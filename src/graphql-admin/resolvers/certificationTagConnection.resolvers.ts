import { InternalError } from "../../graphql/errors/InternalError";
import { Resolvers } from "../../generated";
import { Context } from "../../types/context";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createCertificationTagConnection: async (parent, args: { certification_tag_id: string, vendor_company_id: string }, context) => {
      const { certification_tag_id, vendor_company_id } = args;

      const existingCertificationTagConnection = await context.prisma.certificationTagConnection.findFirst({
        where: {
          certification_tag_id: certification_tag_id,
          vendor_company_id: vendor_company_id,
        },
      });

      if (existingCertificationTagConnection) {
        throw new InternalError('Certification Tag Connection already exist.');
      }

      const certificationTag = await context.prisma.certificationTag.findFirst({
        where: {
          id: certification_tag_id
        }
      });

      if (!certificationTag) {
        throw new InternalError('Certification tag not found.');
      }

      const vendorCompany = await context.prisma.vendorCompany.findFirst({
        where: {
          id: vendor_company_id
        }
      });

      if (!vendorCompany) {
        throw new InternalError('Vendor company not found.');
      }

      return await context.prisma.certificationTagConnection.create({
        data: {
          certification_tag: {
            connect: {
              id: certification_tag_id
            }
          },
          vendor_company: {
            connect: {
              id: vendor_company_id
            }
          },
        }
      });
    },
    deleteCertificationTagConnection: async (parent, args, context) => {
      const { id } = args;

      const existingCertificationTagConnection = await context.prisma.certificationTagConnection.findFirst({
        where: {
          id,
        }
      });

      if (!existingCertificationTagConnection) {
        throw new InternalError('Certification tag connection not found.');
      }

      return await context.prisma.certificationTagConnection.delete({
        where: {
          id: existingCertificationTagConnection.id
        }
      });
    },
  }
}

export default resolvers;
