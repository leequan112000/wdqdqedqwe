import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  LabSpecializationConnection: {
    lab_specialization: async (parent, _, context) => {
      invariant(parent.lab_specialization_id, 'Lab specialization id not found');

      return await context.prisma.labSpecialization.findFirst({
        where: {
          id: parent.lab_specialization_id
        }
      });
    },
    vendor_company: async (parent, _, context) => {
      invariant(parent.vendor_company_id, 'Vendor company id not found.');

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        }
      });
    },
  },
};

export default resolvers;
