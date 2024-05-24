import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import Sentry from "../../sentry";
import { Prisma } from "../../../prisma-cro/generated/client";

const RATE_LIMIT_FIXED_WINDOW = 60; // in second
const RATE_LIMIT_MAX_COUNTS = 15;

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

        if (count >= RATE_LIMIT_MAX_COUNTS) {
          Sentry.withScope((scope) => {
            scope.setLevel("warning");
            scope.setTag("from", "rate-limit");
            scope.setTag("fingerprint", fingerprint);
            Sentry.captureMessage(
              "Someone has reached the search limit.",
              "warning"
            );
            return;
          });
        }

        if (ttl < 0) {
          await context.redis
            .multi()
            .set(userKey, "1", "EX", RATE_LIMIT_FIXED_WINDOW)
            .exec();
        } else {
          await context.redis.multi().incr(userKey).exec();
        }
      }

      let isPaidUser = false;
      if (userId) {
        isPaidUser = !!(await context.prisma.user.findUnique({
          where: { id: userId },
        }));
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
      });

      const vendors = await context.prismaCRODb.vendorCompany.findMany({
        where: vendorCompanyFilter,
        take: first,
        skip: after ? 1 : undefined,
        cursor: after ? { id: after } : undefined,
      });

      let edges = vendors.map((v) => ({
        cursor: v.id,
        node: v,
      }));
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

      if (!isPaidUser) 
        edges = edges.slice(0, 25).map((edge, index) => {
          if (index < 3) {
            return edge;
          } else {
            return {
              ...edge,
              node: {
                ...edge.node,
                company_description: null,
              },
            };
          }
        });
      
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
