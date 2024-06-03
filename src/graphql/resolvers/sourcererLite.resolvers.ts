import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import Sentry from "../../sentry";
import { Prisma } from "../../../prisma-cro/generated/client";
import { CustomerSubscriptionPlanName, SubscriptionStatus } from "../../helper/constant";
import invariant from "../../helper/invariant";
import { PublicError } from "../errors/PublicError";

const RATE_LIMIT_FIXED_WINDOW = 1800; // in second
const UNIQUE_SEARCH_FIXED_WINDOW = 86400; // 24 hours in second
const UNIQUE_SEARCH_MAX_COUNTS = 15;
const RATE_LIMIT_MAX_COUNTS = 15;
const MAX_FREE_RESULT_COUNT = 25;
const MAX_RESULT_COUNT = 50;

const resolvers: Resolvers<Context> = {
  Query: {
    searchVendorByService: async (_, args, context) => {
      const { keyword, fingerprint, ip_address, first, after } = args;
      const userId = context.req.user_id;

      if (fingerprint) {
        let userKey = `rate-limit:single-search-api:${fingerprint}`;

        if (ip_address) {
          userKey = userKey + `-${ip_address}`;
        }

        const result = await context.redis
          .multi()
          .get(userKey)
          .ttl(userKey)
          .exec();

        const count = parseInt((result?.[0][1] as string) || "0", 10);
        const ttl = result?.[1][1] as number;
        const isBlocked = count >= RATE_LIMIT_MAX_COUNTS;
        if (isBlocked) {
          Sentry.withScope((scope) => {
            scope.setLevel("warning");
            scope.setTag("from", "rate-limit");
            scope.setTag("fingerprint", fingerprint);
            Sentry.captureMessage(
              `Someone has tried too many times within ${RATE_LIMIT_FIXED_WINDOW} seconds.`,
              "warning"
            );
            return;
          });
          invariant(!isBlocked, new PublicError('Too many retries. Please try again later.'))
        }

        if (ttl < 0) {
          await context.redis
            .multi()
            .set(userKey, "1", "EX", RATE_LIMIT_FIXED_WINDOW)
            .exec();
        } else {
          await context.redis.multi().incr(userKey).exec();
        }

        let uniqueSearchKey = `${userKey}-unique-search`;
        const hasKeywordSearched = await context.redis.sismember(uniqueSearchKey, keyword);
        if (!hasKeywordSearched) {
          // Check the number of unique searches
          const uniqueSearchCount = await context.redis.scard(uniqueSearchKey);

          if (uniqueSearchCount >= UNIQUE_SEARCH_MAX_COUNTS) {
            Sentry.withScope((scope) => {
              scope.setLevel("warning");
              scope.setTag("from", "unique-search-limit");
              scope.setTag("fingerprint", fingerprint);
              Sentry.captureMessage(
                `Someone has reached the maximum search limit (${UNIQUE_SEARCH_MAX_COUNTS}) per day.`,
                "warning"
              );
              return;
            });
          }

          invariant(uniqueSearchCount < UNIQUE_SEARCH_MAX_COUNTS, new PublicError('You have reached the maximum search limit per day. Please try again in 24 hours.'))

          // Add the search term to the set
          await context.redis.sadd(uniqueSearchKey, keyword);

          // Set the expiration for the key if it is the first search
          const ttl = await context.redis.ttl(uniqueSearchKey);
          if (ttl < 0) {
            await context.redis.expire(uniqueSearchKey, UNIQUE_SEARCH_FIXED_WINDOW);
          }
        }
      }

      let isPaidUser = false;
      if (userId) {
        const customer = (await context.prisma.user.findUnique({
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
                        CustomerSubscriptionPlanName.WHITE_GLOVE_PLAN
                      ]
                    },
                  },
                }
              }
            }
          }
        }))?.customer;
        const has_active_legacy_plan = !!customer?.biotech?.subscriptions && customer?.biotech?.subscriptions.length > 0
        const has_active_sourcerer_or_white_glove_plan = !!customer?.customer_subscriptions && customer?.customer_subscriptions.length > 0
        isPaidUser = has_active_legacy_plan || has_active_sourcerer_or_white_glove_plan;
      }

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

      const totalVendor = await context.prismaCRODb.vendorCompany.findMany({
        where: vendorCompanyFilter,
        take: 50,
      });

      const startSlice = after
        ? totalVendor.findIndex((v) => {
          return v.id === after
        }) + 1
        : 0;

      const endSlice = startSlice + first;

      const vendors = totalVendor.slice(startSlice, endSlice);

      let edges = vendors.map((v) => {
        console.log(v.company_name)
        return {
          cursor: v.id,
          node: v,
        }
      });
      const endCursor =
        edges.length > 0 ? edges[edges.length - 1].cursor : null;
      let hasNextPage = false;

      if (endCursor) {
        const nextVendors = await context.prismaCRODb.vendorCompany.findMany({
          where: vendorCompanyFilter,
          take: first,
          skip: after ? 1 : undefined,
          cursor: endCursor ? { id: endCursor } : undefined,
        });

        hasNextPage = nextVendors.length > 0;
      }


      if (!isPaidUser) {
        if (startSlice >= MAX_FREE_RESULT_COUNT) {
          edges = [];
          hasNextPage = false;
        }
        else if (endSlice >= MAX_FREE_RESULT_COUNT) {
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
                  vendor_company_certifications: []
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
                  vendor_company_certifications: []
                },
              };
            }
          });
        }
      } else {
        if (startSlice >= MAX_RESULT_COUNT) {
          edges = [];
          hasNextPage = false;
        }
        else if (endSlice >= MAX_RESULT_COUNT) {
          hasNextPage = false;
        }
      }

      return {
        edges,
        page_info: {
          end_cursor: endCursor,
          has_next_page: hasNextPage,
          total_count: totalVendor.length,
        },
      };
    },
  },
};

export default resolvers;
