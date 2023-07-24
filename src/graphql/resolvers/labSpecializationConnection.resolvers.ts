import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { Resolvers } from "../../generated";

const resolvers: Resolvers<Context> = {
  LabSpecializationConnection: {
    lab_specialization: async (parent, _, context) => {
      if (!parent.lab_specialization_id) {
        throw new InternalError('Lab specialization id not found');
      }

      return await context.prisma.labSpecialization.findFirst({
        where: {
          id: parent.lab_specialization_id
        }
      });
    },
    vendor_company: async (parent, _, context) => {
      if (!parent.vendor_company_id) {
        throw new InternalError('Vendor company id not found');
      }

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        }
      });
    },
  },
};

export default resolvers;
