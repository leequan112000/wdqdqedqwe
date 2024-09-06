import axios from 'axios';
import { VendorCompany } from '@prisma/client';
import { app_env } from '../../environment';
import { Context } from '../../types/context';
import invariant from '../../helper/invariant';
import { InputMaybe } from '../../graphql/generated';
import { Prisma } from '../../../prisma-cro/generated/client';
import { PublicError } from '../../graphql/errors/PublicError';
import { prismaCRODb } from '../../prisma';
import Sentry from '../../sentry';
import {
  CountryRegion,
  CustomerSubscriptionPlanName,
  SourcingResultSortBy,
  SubscriptionStatus,
} from '../../helper/constant';
import { countryRegionMap, getRegionByCountryCode } from '../../helper/country';

const RATE_LIMIT_FIXED_WINDOW = 1800; // in second
const UNIQUE_SEARCH_FIXED_WINDOW = 86400; // 24 hours in second
const UNIQUE_SEARCH_MAX_COUNTS = 15;
const RATE_LIMIT_MAX_COUNTS = 25;
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
  sort_by: InputMaybe<string> | undefined;
  filter_country_by: InputMaybe<string> | undefined;
  is_paid_user: boolean;
};

export const matchVendorByService = async (
  args: MatchVendorByServiceArgs,
  ctx: Context,
) => {
  const { keyword, first, after, sort_by, filter_country_by, is_paid_user } =
    args;

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
    ...(!filter_country_by || filter_country_by === CountryRegion.ALL
      ? {}
      : {
          vendor_company_locations: {
            some: {
              country: {
                in: Object.keys(countryRegionMap).filter(
                  (countryCode) =>
                    getRegionByCountryCode(countryCode) === filter_country_by,
                ),
              },
            },
          },
        }),
  };

  const vendorCompanySorting:
    | Prisma.VendorCompanyOrderByWithRelationInput
    | Prisma.VendorCompanyOrderByWithRelationInput[]
    | undefined = (() => {
    switch (sort_by) {
      case SourcingResultSortBy.ALPHABETICAL:
        return { company_name: 'asc' };
      case SourcingResultSortBy.REVENUE:
        return { company_revenue_value: 'desc' };
      case SourcingResultSortBy.TEAM_SIZE:
        return { company_average_size: 'desc' };
      case SourcingResultSortBy.BEST_MATCH:
      default:
        return undefined;
    }
  })();

  const vendorCompanies = await ctx.prismaCRODb!.vendorCompany.findMany({
    where: vendorCompanyFilter,
    take: 50,
    include: {
      vendor_company_subspecialties: true,
      vendor_company_locations: true,
      vendor_company_certifications: true,
      vendor_company_types: true,
    },
    orderBy: vendorCompanySorting,
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
        if (index < 25) {
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
        if (index < 25) {
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
    related_subspecialty_names: [keyword],
  };
};

export type MatchVendorByServicesArgs = {
  subspecialty_ids: string[];
  subspecialty_names: string[];
  first: number;
  after: InputMaybe<string> | undefined;
  sort_by: InputMaybe<string> | undefined;
  filter_country_by: InputMaybe<string> | undefined;
  is_paid_user: boolean;
};

export const matchVendorByServices = async (
  args: MatchVendorByServicesArgs,
  ctx: Context,
) => {
  const {
    subspecialty_ids,
    subspecialty_names,
    first,
    after,
    sort_by,
    filter_country_by,
    is_paid_user,
  } = args;

  let countryFilterWhereClause = (() => {
    if (filter_country_by && filter_country_by !== CountryRegion.ALL) {
      const countryCodes = Object.keys(countryRegionMap).filter(
        (countryCode) =>
          getRegionByCountryCode(countryCode) === filter_country_by,
      );

      // If there are no matching country codes, return an empty string
      if (countryCodes.length === 0) {
        return true;
      }

      // Construct the WHERE clause using Prisma's SQL tagged template
      return Prisma.sql`
        vc.id IN (
          SELECT vcl.vendor_company_id
          FROM vendor_company_locations vcl
          WHERE vcl.country IN (${Prisma.join(countryCodes)})
        )
      `;
    }
    return true;
  })();

  let orderByClause = (() => {
    switch (sort_by) {
      case SourcingResultSortBy.ALPHABETICAL:
        return 'vc.company_name ASC';
      case SourcingResultSortBy.REVENUE:
        return 'vc.company_revenue_value DESC';
      case SourcingResultSortBy.TEAM_SIZE:
        return 'vc.company_average_size DESC';
      case SourcingResultSortBy.BEST_MATCH:
      default:
        return 'vs.score DESC, vtsc.total_count DESC';
    }
  })();

  const sortedVendorCompanies: VendorCompany[] =
    await prismaCRODb.$queryRaw(Prisma.sql`
    WITH VendorScores AS (
      SELECT
        vc.company_name,
        vcs.vendor_company_id,
        COUNT(*) * 0.5 AS score
      FROM vendor_company_subspecialties vcs
      JOIN vendor_companies vc ON vcs.vendor_company_id = vc.id
      WHERE
        vcs.subspecialty_id = ANY(${subspecialty_ids}::uuid[])
        AND vc.is_active = true
        AND ${countryFilterWhereClause}
      GROUP BY
        vc.company_name,
        vcs.vendor_company_id
    ),
    VendorTotalServiceCounts AS (
      SELECT
        vcs.vendor_company_id,
        COUNT(*) AS total_count
      FROM vendor_company_subspecialties vcs
      GROUP BY vcs.vendor_company_id
    )
    SELECT
      vc.*
    FROM VendorScores vs
    JOIN VendorTotalServiceCounts vtsc ON vs.vendor_company_id = vtsc.vendor_company_id
    JOIN vendor_companies vc ON  vs.vendor_company_id = vc.id
    GROUP BY vc.id, vs.score, vtsc.total_count
    ORDER BY ${Prisma.raw(orderByClause)}
    LIMIT 50;
  `);

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

  if (!is_paid_user) {
    if (startSlice >= MAX_FREE_RESULT_COUNT) {
      edges = [];
      hasNextPage = false;
    } else if (endSlice >= MAX_FREE_RESULT_COUNT) {
      hasNextPage = false;
      edges = edges.map((edge, index) => {
        if (index < 25) {
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
        if (index < 25) {
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
      total_count: sortedVendorCompanies.length,
    },
    related_subspecialty_names: subspecialty_names,
  };
};

export type SearchSubspecialtiesSemanticallyArgs = {
  search_term: string;
};

export const searchSubspecialtiesSemantically = async (
  args: SearchSubspecialtiesSemanticallyArgs,
) => {
  try {
    const { search_term } = args;
    const response = await axios({
      method: 'post',
      url: `${app_env.AI_SERVER_URL}/search-subspecialties/`,
      data: {
        search_term,
      },
    });

    return response.data.results;
  } catch (error) {
    throw error;
  }
};

export type CheckSpellingArgs = {
  keyword: string;
};

export const checkSpelling = async (args: CheckSpellingArgs) => {
  try {
    const { keyword } = args;
    const response = await axios({
      method: 'post',
      url: `${app_env.AI_SERVER_URL}/spelling-corrector/`,
      data: {
        keyword,
      },
    });

    return response.data.results;
  } catch (error) {
    throw error;
  }
};

const sourcererLiteService = {
  checkRateLimit,
  checkIsPaidUser,
  checkSpelling,
  matchVendorByService,
  matchVendorByServices,
  searchSubspecialtiesSemantically,
};

export default sourcererLiteService;
