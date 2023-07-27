import { Request } from "express";
import { Context } from "../../types/context";
import invariant from "../../helper/invariant";

export default {
  LabSpecializationConnection: {
    lab_specialization: async (parent: any, _: void, context: Context): Promise<any> => {
      invariant(parent.lab_specialization_id, 'Lab specialization id not found');

      return await context.prisma.labSpecialization.findFirst({
        where: {
          id: parent.lab_specialization_id
        }
      });
    },
    vendor_company: async (parent: any, _: void, context: Context): Promise<any> => {
      invariant(parent.vendor_company_id, 'Vendor company id not found.');

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        }
      });
    },
  },
  Query: {
    lab_specialization_connection: async (_: void, args: { lab_specialization_id: string }, context: Context & { req: Request }) => {
      const { lab_specialization_id } = args;

      return await context.prisma.labSpecializationConnection.findFirst({
        where: {
          lab_specialization_id: lab_specialization_id
        },
        include: {
          vendor_company: true,
          lab_specialization: true,
        }
      });
    },
    lab_specialization_connections: async (_: void, args: { vendor_company_id: string }, context: Context & { req: Request }) => {
      const { vendor_company_id } = args;

      return await context.prisma.labSpecializationConnection.findMany({
        where: {
          vendor_company_id: vendor_company_id
        },
        include: {
          lab_specialization: true,
        }
      });
    },
  },
  Mutation: {
    createLabSpecializationConnection: async (_: void, args: { lab_specialization_id: string, vendor_company_id: string }, context: Context & { req: Request }) => {
      const { lab_specialization_id, vendor_company_id } = args;

      const existingLabSpecializationConnection = await context.prisma.labSpecializationConnection.findFirst({
        where: {
          lab_specialization_id: lab_specialization_id,
          vendor_company_id: vendor_company_id,
        }
      });

      invariant(!existingLabSpecializationConnection, 'Lab specialization connection already exists.');

      const labSpecialization = await context.prisma.labSpecialization.findFirst({
        where: {
          id: lab_specialization_id
        }
      });

      invariant(labSpecialization, 'Lab specialization not found.');

      const vendorCompany = await context.prisma.vendorCompany.findFirst({
        where: {
          id: vendor_company_id
        }
      });

      invariant(vendorCompany, 'Vendor company not found.');

      return await context.prisma.labSpecializationConnection.create({
        data: {
          lab_specialization: {
            connect: {
              id: lab_specialization_id
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
    deleteLabSpecializationConnection: async (_: void, args: { lab_specialization_connection_id: string }, context: Context & { req: Request }) => {
      const { lab_specialization_connection_id } = args;

      const existingLabSpecializationConnection = await context.prisma.labSpecializationConnection.findFirst({
        where: {
          id: lab_specialization_connection_id
        }
      });

      invariant(existingLabSpecializationConnection, 'Lab specialization connection not found.');

      await context.prisma.labSpecializationConnection.delete({
        where: {
          id: existingLabSpecializationConnection.id
        }
      });

      return true;
    },
  },
};
