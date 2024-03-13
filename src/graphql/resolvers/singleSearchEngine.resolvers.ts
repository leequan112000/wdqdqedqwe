import { Context } from "../../types/context";
import { Resolvers } from "../generated";

function extractTeamSize(vendor: { company_size: string | null }) {
  const teamSizeRange = vendor.company_size || "0-0";
  const [min, max] = teamSizeRange.replace(/,/g, "").split(/—|-/).map(Number);
  return (min + max) / 2; // Use the average value for comparison
}

const resolvers: Resolvers<Context> = {
  Query: {
    singleVendorSearch: async (_, args, context) => {
      const { keyword } = args;
      const userId = context.req.user_id;

      let isPaidUser = false
      if (userId)  {
        isPaidUser = !!(await context.prisma.user.findUnique({
        where: { id: userId },
      }))};

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
      );

      vendors.sort((a, b) => {
        return extractTeamSize(a) - extractTeamSize(b);
      });

      const edges = vendors.map((v) => ({
        cursor: v.id,
        node: v,
      }));

      return {
        edges: isPaidUser ? edges : edges.slice(0, 1),
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
