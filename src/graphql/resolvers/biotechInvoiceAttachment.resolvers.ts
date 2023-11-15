import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  BiotechInvoiceAttachment: {
    biotech_invoice: async (parent, _, context) => {
      invariant(parent.biotech_invoice_id, 'Biotech Invoice ID not found.');
      return await context.prisma.biotechInvoice.findFirst({
        where: {
          id: parent.biotech_invoice_id,
        },
      });
    },
  },
};

export default resolvers;
