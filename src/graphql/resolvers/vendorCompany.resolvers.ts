import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../../generated";
import { InternalError } from "../errors/InternalError";

const resolvers: Resolvers<Context> = {
  VendorCompany: {
    vendor_members: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Vendor company id not found.')
      }
      return await context.prisma.vendorMember.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
    project_connections: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Vendor company id not found.')
      }
      return await context.prisma.projectConnection.findMany({
        where: {
          vendor_company_id: parent.id
        }
      })
    },
    chats: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Vendor company id not found.')
      }
      return await context.prisma.chat.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
    primary_members: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Vendor company id not found.')
      }

      const primaryMembers = await context.prisma.vendorMember.findMany({
        where: {
          vendor_company_id: parent.id,
          is_primary_member: true,
        },
      });

      return primaryMembers;
    }
  },
  Query: {
    vendorCompany: async (_, __, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const vendorMember = await trx.vendorMember.findFirstOrThrow({
          where: {
            user_id: context.req.user_id,
          },
        });

        return await trx.vendorCompany.findFirst({
          where: {
            id: vendorMember.vendor_company_id
          }
        })
      });
    },
  },
  Mutation: {
    onboardVendorCompany: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const user = await trx.user.findFirstOrThrow({
          where: {
            id: context.req.user_id,
          },
          include: {
            vendor_member: {
              include: {
                vendor_company: true
              }
            }
          }
        });

        if (!user.vendor_member) {
          throw new PublicError('Vendor member not found.');
        }

        return await trx.vendorCompany.update({
          where: {
            id: user.vendor_member.vendor_company_id
          },
          data: {
            legal_name: args.legal_name,
            description: args.description,
            website: args.website,
            address: args.address,
            address1: args.address1,
            address2: args.address2,
            city: args.city,
            state: args.state,
            country: args.country,
            zipcode: args.zipcode,
            ...(args.name !== null ? { name: args.name } : {}),
          }
        })
      });
    },
    updateVendorCompany: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const vendor_member = await trx.vendorMember.findFirst({
          where: {
            user_id: context.req.user_id,
          },
        });

        if (!vendor_member) {
          throw new PublicError('Vendor member not found.');
        }

        return await trx.vendorCompany.update({
          where: {
            id: vendor_member.vendor_company_id
          },
          data: {
            legal_name: args.legal_name,
            description: args.description,
            website: args.website,
            address: args.address,
            address1: args.address1,
            address2: args.address2,
            city: args.city,
            state: args.state,
            country: args.country,
            zipcode: args.zipcode,
            ...(args.name !== null ? { name: args.name } : {}),
          }
        })
      });
    },
  }
};

export default resolvers;