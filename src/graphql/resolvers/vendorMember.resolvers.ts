import { User, VendorCompany, VendorMember } from "@prisma/client";
import { Request } from "express";
import { createResetPasswordToken } from "../../helper/auth";
import { sendVendorMemberInvitationByExistingMemberEmail, sendVendorMemberInvitationByBiotechEmail } from "../../mailer/vendorMember";
import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import {
  MutationInviteVendorMemberArgs,
  MutationUpdateVendorMemberArgs,
  MutationInviteVendorMemberByBiotechArgs,
} from "../../generated";
import { BiotechInviteVendorMemberData } from "../../mailer/types";

export default {
  VendorMember: {
    user: async (parent: VendorMember, _: void, context: Context): Promise<User | null> => {
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      });
    },
    vendor_company: async (parent: VendorMember, _: void, context: Context): Promise<VendorCompany | null> => {
      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        }
      });
    },
  },
  Query: {
    vendorMember: async (_: void, args: void, context: Context & { req: Request }) => {
      return await context.prisma.vendorMember.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });
    },
  },
  Mutation: {
    updateVendorMember: async (_: void, args: MutationUpdateVendorMemberArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.vendorMember.update({
          where: {
            user_id: context.req.user_id
          },
          data: {
            title: args.title,
            phone: args.phone,
            department: args.department,
            ...(args.is_primary_member !== null ? { is_primary_member: args.is_primary_member } : {}),
          }
        });
      } catch (error) {
        return error;
      }
    },
    inviteVendorMember: async (_: void, args: MutationInviteVendorMemberArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const user = await trx.user.findFirst({
            where: {
              email: args.email
            }
          });

          if (user) {
            throw new PublicError('User already exist!');
          }

          const currentUser = await trx.user.findFirstOrThrow({
            where: {
              id: context.req.user_id
            },
            include: {
              vendor_member: true
            }
          });

          const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
          const newUser = await trx.user.create({
            data: {
              ...args,
              reset_password_token: createResetPasswordToken(),
              reset_password_expiration: new Date(resetTokenExpiration),
            }
          });

          const newVendorMember = await trx.vendorMember.create({
            data: {
              user_id: newUser.id,
              vendor_company_id: currentUser.vendor_member?.vendor_company_id!,
            }
          });

          sendVendorMemberInvitationByExistingMemberEmail(currentUser, newUser, args.custom_message || "");

          return newVendorMember;
        });
      } catch (error) {
        return error;
      }
    },
    inviteVendorMemberByBiotech: async (_: void, args: MutationInviteVendorMemberByBiotechArgs, context: Context & { req: Request }) => {
      if (process.env.BIOTECH_INVITE_CRO) {
        return await context.prisma.$transaction(async (trx) => {
          const vendorCompany = await trx.vendorCompany.findFirst({
            where: {
              name: args.vendor_company_name,
            },
          });
  
          if (vendorCompany) {
            throw new PublicError('Vendor company already exist');
          }
  
          const user = await trx.user.findFirst({
            where: {
              email: args.email,
            },
          });
  
          if (user) {
            throw new PublicError('User already exist');
          }
  
          const customer = await trx.user.findFirst({
            where: {
              id: args.customer_user_id,
            },
          });
  
          if (!customer) {
            throw new PublicError('Customer not found');
          }
  
          const biotech = await trx.biotech.findFirst({
            where: {
              id: args.biotech_id,
            },
          });
  
          if (!biotech) {
            throw new PublicError('Biotech not found');
          }
          
          const newVendorCompany = await context.prisma.vendorCompany.create({
            data: {
              name: args.vendor_company_name,
              website: args.website,
              description: args.description,
              address: args.address,
              is_on_marketplace: false,
              invited_by: args.biotech_id,
            }
          });
  
          const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
          const newUser = await trx.user.create({
            data: {
              email: args.email,
              first_name: args.first_name,
              last_name: args.last_name,
              reset_password_token: createResetPasswordToken(),
              reset_password_expiration: new Date(resetTokenExpiration),
            }
          });
  
          const newVendorMember = await trx.vendorMember.create({
            data: {
              user_id: newUser.id,
              vendor_company_id: newVendorCompany.id,
              is_primary_member: true,
            }
          });
  
          const data: BiotechInviteVendorMemberData = {
            inviter_first_name: customer.first_name,
            inviter_last_name: customer.last_name,
            biotech_name: biotech.name,
          }
  
          // TODO: send email to new vendor member by biotech
          sendVendorMemberInvitationByBiotechEmail(newUser, data);        
          return newVendorMember;
        });
      }
      return null;
    },
  }
};
