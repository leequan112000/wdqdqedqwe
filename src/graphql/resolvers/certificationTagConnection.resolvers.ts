import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';

const resolvers: Resolvers<Context> = {
  CertificationTagConnection: {
    certification_tag: async (parent, _, context) => {
      invariant(parent.certification_tag_id, 'Certification tag id not found.');

      return await context.prisma.certificationTag.findFirst({
        where: {
          id: parent.certification_tag_id,
        },
      });
    },
    vendor_company: async (parent, _, context) => {
      invariant(parent.vendor_company_id, 'Vendor company id not found');

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id,
        },
      });
    },
  },
};

export default resolvers;
