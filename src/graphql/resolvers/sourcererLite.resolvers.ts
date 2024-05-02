import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import Sentry from "../../sentry";

const extractTeamSize = (vendor: { company_size: string | null }) => {
  const teamSizeRange = vendor.company_size || "0-0";
  const [min, max] = teamSizeRange.replace(/,/g, "").split(/—|-/).map(Number);
  return (min + max) / 2; // Use the average value for comparison
}

const RATE_LIMIT_FIXED_WINDOW = 60; // in second
const RATE_LIMIT_MAX_COUNTS = 15;

const resolvers: Resolvers<Context> = {
  Query: {
    searchVendorByService: async (_, args, context) => {
      const { keyword, fingerprint, ip_address } = args;
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

      const subspecialtiesWithVendor = await context.prismaCRODb.subspecialty
        .findFirst({
          where: {
            name: keyword,
          },
        })
        .vendor_company_subspecialties({
          include: {
            vendor_company: true,
          },
        });

      const vendors = (subspecialtiesWithVendor || []).map(
        (v) => v.vendor_company
      ).filter((v) => v.company_description !== null && v.company_ipo_status !== null);

      vendors.sort((a, b) => {
        return extractTeamSize(a) - extractTeamSize(b);
      });

      const edges = vendors.map((v) => ({
        cursor: v.id,
        node: v,
      }));

      return {
        edges: isPaidUser ? edges : edges.slice(0, 25),
        pageInfo: {
          endCursor: "",
          hasNextPage: false,
          hasPreviousPage: false,
          total_matched: vendors.length,
        },
      };
    },
  },
};

export default resolvers;
