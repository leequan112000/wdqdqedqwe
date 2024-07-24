import { Context } from '../../types/context';
import invariant from '../../helper/invariant';
import { InputMaybe } from '../../graphql/generated';
import { Prisma } from '../../../prisma-cro/generated/client';
import { PublicError } from '../../graphql/errors/PublicError';
import Sentry from '../../sentry';
import {
  CustomerSubscriptionPlanName,
  SubscriptionStatus,
} from '../../helper/constant';

const RATE_LIMIT_FIXED_WINDOW = 1800; // in second
const UNIQUE_SEARCH_FIXED_WINDOW = 86400; // 24 hours in second
const UNIQUE_SEARCH_MAX_COUNTS = 15;
const RATE_LIMIT_MAX_COUNTS = 15;
const MAX_FREE_RESULT_COUNT = 25;
const MAX_RESULT_COUNT = 50;

export type CheckRateLimitArgs = {
  keyword: string;
  fingerprint: InputMaybe<string> | undefined;
  ip_address: InputMaybe<string> | undefined;
};

export const checkRateLimit = async (
  args: CheckRateLimitArgs,
  ctx: Context,
) => {
  const { keyword, fingerprint, ip_address } = args;
  if (fingerprint) {
    let userKey = `rate-limit:single-search-api:${fingerprint}`;

    if (ip_address) {
      userKey = userKey + `-${ip_address}`;
    }

    const result = await ctx.redis.multi().get(userKey).ttl(userKey).exec();

    const count = parseInt((result?.[0][1] as string) || '0', 10);
    const ttl = result?.[1][1] as number;
    const isBlocked = count >= RATE_LIMIT_MAX_COUNTS;
    if (isBlocked) {
      Sentry.withScope((scope) => {
        scope.setLevel('warning');
        scope.setTag('from', 'rate-limit');
        scope.setTag('fingerprint', fingerprint);
        Sentry.captureMessage(
          `Someone has tried too many times within ${RATE_LIMIT_FIXED_WINDOW} seconds.`,
          'warning',
        );
        return;
      });
      invariant(
        !isBlocked,
        new PublicError('Too many retries. Please try again later.'),
      );
    }

    if (ttl < 0) {
      await ctx.redis
        .multi()
        .set(userKey, '1', 'EX', RATE_LIMIT_FIXED_WINDOW)
        .exec();
    } else {
      await ctx.redis.multi().incr(userKey).exec();
    }

    let uniqueSearchKey = `${userKey}-unique-search`;
    // Check the number of unique searches
    const uniqueSearchCount = await ctx.redis.scard(uniqueSearchKey);
    if (uniqueSearchCount >= UNIQUE_SEARCH_MAX_COUNTS) {
      Sentry.withScope((scope) => {
        scope.setLevel('warning');
        scope.setTag('from', 'unique-search-limit');
        scope.setTag('fingerprint', fingerprint);
        Sentry.captureMessage(
          `Someone has reached the maximum search limit (${UNIQUE_SEARCH_MAX_COUNTS}) per day.`,
          'warning',
        );
        return;
      });
    }
    invariant(
      uniqueSearchCount < UNIQUE_SEARCH_MAX_COUNTS,
      new PublicError(
        'You have reached the maximum search limit per day. Please try again in 24 hours.',
      ),
    );

    const hasKeywordSearched = await ctx.redis.sismember(
      uniqueSearchKey,
      keyword,
    );
    if (!hasKeywordSearched) {
      // Add the search term to the set
      await ctx.redis.sadd(uniqueSearchKey, keyword);

      // Set the expiration for the key if it is the first search
      const ttl = await ctx.redis.ttl(uniqueSearchKey);
      if (ttl < 0) {
        await ctx.redis.expire(uniqueSearchKey, UNIQUE_SEARCH_FIXED_WINDOW);
      }
    }
  }
};

export const checkIsPaidUser = async (ctx: Context) => {
  const userId = ctx.req.user_id;
  let isPaidUser = false;
  if (userId) {
    const customer = (
      await ctx.prisma.user.findUnique({
        where: { id: userId },
        include: {
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: {
                    where: {
                      status: SubscriptionStatus.ACTIVE,
                      OR: [
                        { ended_at: null },
                        {
                          ended_at: {
                            gt: new Date(),
                          },
                        },
                      ],
                    },
                  },
                },
              },
              customer_subscriptions: {
                where: {
                  status: SubscriptionStatus.ACTIVE,
                  plan_name: {
                    in: [
                      CustomerSubscriptionPlanName.SOURCING_PLAN,
                      CustomerSubscriptionPlanName.WHITE_GLOVE_PLAN,
                    ],
                  },
                },
              },
            },
          },
        },
      })
    )?.customer;
    const has_active_legacy_plan =
      !!customer?.biotech?.subscriptions &&
      customer?.biotech?.subscriptions.length > 0;
    const has_active_sourcerer_or_white_glove_plan =
      !!customer?.customer_subscriptions &&
      customer?.customer_subscriptions.length > 0;
    isPaidUser =
      has_active_legacy_plan || has_active_sourcerer_or_white_glove_plan;
  }

  return isPaidUser;
};

export type MatchVendorByServiceArgs = {
  keyword: string;
  first: number;
  after: InputMaybe<string> | undefined;
  is_paid_user: boolean;
};

export const matchVendorByService = async (
  args: MatchVendorByServiceArgs,
  ctx: Context,
) => {
  const { keyword, first, after, is_paid_user } = args;

  const vendorCompanyFilter: Prisma.VendorCompanyWhereInput = {
    vendor_company_subspecialties: {
      some: {
        subspecialty: {
          name: keyword,
        },
      },
    },
    NOT: {
      company_description: null,
      company_ipo_status: null,
    },
    is_active: true,
  };

  const vendorCompanies = await ctx.prismaCRODb!.vendorCompany.findMany({
    where: vendorCompanyFilter,
    take: 50,
    include: {
      vendor_company_subspecialties: true,
      vendor_company_locations: true,
      vendor_company_certifications: true,
      vendor_company_types: true,
    },
  });

  const startSlice = after
    ? vendorCompanies.findIndex((v) => {
        return v.id === after;
      }) + 1
    : 0;

  const endSlice = startSlice + first;

  const paginatedVendorCompanies = vendorCompanies.slice(startSlice, endSlice);

  let edges = paginatedVendorCompanies.map((v) => {
    return {
      cursor: v.id,
      node: v,
    };
  });
  const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
  let hasNextPage = false;

  if (endCursor) {
    const nextVendorCompanies = await ctx.prismaCRODb!.vendorCompany.findMany({
      where: vendorCompanyFilter,
      take: first,
      skip: after ? 1 : undefined,
      cursor: endCursor ? { id: endCursor } : undefined,
    });

    hasNextPage = nextVendorCompanies.length > 0;
  }

  if (!is_paid_user) {
    if (startSlice >= MAX_FREE_RESULT_COUNT) {
      edges = [];
      hasNextPage = false;
    } else if (endSlice >= MAX_FREE_RESULT_COUNT) {
      hasNextPage = false;
      edges = edges.map((edge, index) => {
        if (index < 3) {
          return edge;
        } else {
          return {
            ...edge,
            node: {
              ...edge.node,
              company_description: null,
              company_ipo_status: null,
              vendor_company_subspecialties: [],
              vendor_company_locations: [],
              vendor_company_certifications: [],
            },
          };
        }
      });
    } else {
      edges = edges.map((edge, index) => {
        if (index < 3) {
          return edge;
        } else {
          return {
            ...edge,
            node: {
              ...edge.node,
              company_description: null,
              company_ipo_status: null,
              vendor_company_subspecialties: [],
              vendor_company_locations: [],
              vendor_company_certifications: [],
            },
          };
        }
      });
    }
  } else {
    if (startSlice >= MAX_RESULT_COUNT) {
      edges = [];
      hasNextPage = false;
    } else if (endSlice >= MAX_RESULT_COUNT) {
      hasNextPage = false;
    }
  }

  return {
    edges,
    page_info: {
      end_cursor: endCursor,
      has_next_page: hasNextPage,
      total_count: vendorCompanies.length,
    },
  };
};

export type MatchVendorByServicesArgs = {
  subspecialty_ids: string[];
  first: number;
  after: InputMaybe<string> | undefined;
  is_paid_user: boolean;
};

export const matchVendorByServices = async (
  args: MatchVendorByServicesArgs,
  ctx: Context,
) => {
  const { subspecialty_ids, first, after, is_paid_user } = args;
  const vendorCompanyFilter: Prisma.VendorCompanyWhereInput = {
    vendor_company_subspecialties: {
      some: {
        subspecialty: {
          id: {
            in: subspecialty_ids,
          },
        },
      },
    },
    NOT: {
      company_description: null,
      company_ipo_status: null,
    },
    is_active: true,
  };

  const vendorCompanies = await ctx.prismaCRODb!.vendorCompany.findMany({
    where: vendorCompanyFilter,
    take: 50,
    include: {
      vendor_company_subspecialties: true,
      vendor_company_locations: true,
      vendor_company_certifications: true,
      vendor_company_types: true,
    },
  });

  const sortedVendorCompanies = vendorCompanies
    .map((company) => {
      const match_count = company.vendor_company_subspecialties.filter(
        (subspecialty) =>
          subspecialty_ids.includes(subspecialty.subspecialty_id),
      ).length;

      return {
        ...company,
        match_count,
      };
    })
    .sort((a, b) => {
      // First sort by match_count
      if (b.match_count !== a.match_count) {
        return b.match_count - a.match_count;
      }
      // If match_count is the same, sort by the length of vendor_company_subspecialties
      return (
        b.vendor_company_subspecialties.length -
        a.vendor_company_subspecialties.length
      );
    });

  const startSlice = after
    ? sortedVendorCompanies.findIndex((v) => {
        return v.id === after;
      }) + 1
    : 0;

  const endSlice = startSlice + first;

  const paginatedVendorCompanies = sortedVendorCompanies.slice(
    startSlice,
    endSlice,
  );

  let edges = paginatedVendorCompanies.map((v) => {
    return {
      cursor: v.id,
      node: v,
    };
  });
  const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
  let hasNextPage = false;

  if (endCursor) {
    const nextVendorCompanies = await ctx.prismaCRODb!.vendorCompany.findMany({
      where: vendorCompanyFilter,
      take: first,
      skip: after ? 1 : undefined,
      cursor: endCursor ? { id: endCursor } : undefined,
    });

    hasNextPage = nextVendorCompanies.length > 0;
  }

  if (!is_paid_user) {
    if (startSlice >= MAX_FREE_RESULT_COUNT) {
      edges = [];
      hasNextPage = false;
    } else if (endSlice >= MAX_FREE_RESULT_COUNT) {
      hasNextPage = false;
      edges = edges.map((edge, index) => {
        if (index < 3) {
          return edge;
        } else {
          return {
            ...edge,
            node: {
              ...edge.node,
              company_description: null,
              company_ipo_status: null,
              vendor_company_subspecialties: [],
              vendor_company_locations: [],
              vendor_company_certifications: [],
            },
          };
        }
      });
    } else {
      edges = edges.map((edge, index) => {
        if (index < 3) {
          return edge;
        } else {
          return {
            ...edge,
            node: {
              ...edge.node,
              company_description: null,
              company_ipo_status: null,
              vendor_company_subspecialties: [],
              vendor_company_locations: [],
              vendor_company_certifications: [],
            },
          };
        }
      });
    }
  } else {
    if (startSlice >= MAX_RESULT_COUNT) {
      edges = [];
      hasNextPage = false;
    } else if (endSlice >= MAX_RESULT_COUNT) {
      hasNextPage = false;
    }
  }

  return {
    edges,
    page_info: {
      end_cursor: endCursor,
      has_next_page: hasNextPage,
      total_count: vendorCompanies.length,
    },
  };
};

const sourcererLiteService = {
  checkRateLimit,
  checkIsPaidUser,
  matchVendorByService,
  matchVendorByServices,
};

export default sourcererLiteService;
