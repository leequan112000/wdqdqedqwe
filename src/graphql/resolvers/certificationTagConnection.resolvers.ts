import { Request } from "express";
import { Context } from "../../types/context";
import invariant from "../../helper/invariant";

export default {
  CertificationTagConnection: {
    certification_tag: async (parent: any, _: void, context: Context): Promise<any> => {
      invariant(parent.certification_tag_id, 'Certification tag id not found.');

      return await context.prisma.certificationTag.findFirst({
        where: {
          id: parent.certification_tag_id
        }
      });
    },
    vendor_company: async (parent: any, _: void, context: Context): Promise<any> => {
      invariant(parent.vendor_company_id, 'Vendor company id not found.');

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        },
      });
    },
  },
  Query: {
    certification_tag_connection: async (_: void, args: { certification_tag_id: string }, context: Context & { req: Request }) => {
      const { certification_tag_id } = args;

      return await context.prisma.certificationTagConnection.findFirst({
        where: {
          certification_tag_id: certification_tag_id
        },
        include: {
          vendor_company: true,
          certification_tag: true,
        }
      });
    },
    certification_tag_connections: async (_: void, args: { vendor_company_id: string }, context: Context & { req: Request }) => {
      const { vendor_company_id } = args;

      return await context.prisma.certificationTagConnection.findMany({
        where: {
          vendor_company_id: vendor_company_id
        },
        include: {
          certification_tag: true,
        }
      });
    },
  },
  Mutation: {
    createCertificationTagConnection: async (_: void, args: { certification_tag_id: string, vendor_company_id: string }, context: Context & { req: Request }) => {
      const { certification_tag_id, vendor_company_id } = args;

      const existingCertificationTagConnection = await context.prisma.certificationTagConnection.findFirst({
        where: {
          certification_tag_id: certification_tag_id,
          vendor_company_id: vendor_company_id,
        }
      });

      invariant(!existingCertificationTagConnection, 'Certification tag connection already exists.');

      const certificationTag = await context.prisma.certificationTag.findFirst({
        where: {
          id: certification_tag_id
        }
      });

      invariant(certificationTag, 'Certification tag not found.');

      const vendorCompany = await context.prisma.vendorCompany.findFirst({
        where: {
          id: vendor_company_id
        }
      });

      invariant(vendorCompany, 'Vendor company not found.');

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
          }
        }
      });
    },
    deleteCertificationTagConnection: async (_: void, args: { certification_tag_connection_id: string }, context: Context & { req: Request }) => {
      const { certification_tag_connection_id } = args;

      const existingCertificationTagConnection = await context.prisma.certificationTagConnection.findFirst({
        where: {
          id: certification_tag_connection_id
        }
      });

      invariant(existingCertificationTagConnection, 'Certification tag connection not found.');

      return await context.prisma.certificationTagConnection.delete({
        where: {
          id: existingCertificationTagConnection.id
        }
      });
    },
  },
};
