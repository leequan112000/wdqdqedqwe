import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";
import { getSignedUrl } from "../../helper/awsS3";

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
    signed_url: async (parent) => {
      invariant(parent.key, 'Biotech invoice attachment key not found.');

      return await getSignedUrl(parent.key);
    },
  },
};

export default resolvers;
