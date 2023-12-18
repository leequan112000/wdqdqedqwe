import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import {
  checkPassword,
  createTokens,
  hashPassword,
  createResetPasswordToken,
} from "../../helper/auth";
import {
  createBiotechCda,
  createBiotechViewCdaSession,
  createVendorCompanyCda,
  createVendorCompanyViewCdaSession,
} from "../../helper/pandadoc";
import { verify } from "jsonwebtoken";
import { Request } from "express";
import { Resolvers } from "../generated";
import { InternalError } from "../errors/InternalError";
import {
  CasbinRole,
  CompanyCollaboratorRoleType,
  UserType,
  VendorType,
} from "../../helper/constant";
import invariant from "../../helper/invariant";
import { addRoleForUser } from "../../helper/casbin";
import authService from "../../services/auth/auth.service";

const resolvers: Resolvers<Context> = {
  User: {
    user_type: async (parent, _, context) => {
      if (parent.user_type) return parent.user_type;
      if (!parent.id) return null;

      const user = await context.prisma.user.findFirst({
        where: {
          id: parent.id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });
      const isVendor = !!user?.vendor_member;
      const isBiotech = !!user?.customer;
      if (isVendor) {
        return UserType.VENDOR;
      }
      if (isBiotech) {
        return UserType.CUSTOMER;
      }

      return null;
    },
    has_completed_onboarding: async (parent, _, context) => {
      invariant(parent.id, "Missing user id.");
      const result = await context.prisma.user.findFirst({
        where: {
          id: parent.id,
        },
        include: {
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: true,
                },
              },
            },
          },
          vendor_member: {
            include: {
              vendor_company: {
                include: {
                  certification_tag_connections: true,
                  lab_specialization_connections: true,
                },
              },
            },
          },
        },
      });

      if (result?.vendor_member && !result.vendor_member.title) {
        return false;
      }

      if (
        result?.vendor_member &&
        result.vendor_member.vendor_company?.certification_tag_connections
          ?.length === 0 &&
        !result.vendor_member.vendor_company.skip_certification_tag
      ) {
        return false;
      }

      if (
        result?.vendor_member &&
        result.vendor_member.vendor_company?.lab_specialization_connections
          ?.length === 0 &&
        !result.vendor_member.vendor_company.skip_lab_specialization
      ) {
        return false;
      }

      if (result?.customer && !result.customer.job_title) {
        return false;
      }

      if (
        result?.customer &&
        result.customer.biotech.subscriptions.length === 0
      ) {
        return false;
      }

      if (process.env.DISABLE_CDA === "true") {
        return true;
      } else {
        if (
          result?.customer?.biotech?.cda_signed_at ||
          (!result?.customer?.biotech?.cda_signed_at &&
            result?.customer?.biotech?.skip_cda) ||
          result?.vendor_member?.vendor_company?.cda_signed_at ||
          (!result?.vendor_member?.vendor_company?.cda_signed_at &&
            result?.vendor_member?.vendor_company?.skip_cda) ||
          result?.vendor_member?.vendor_company?.vendor_type ===
            VendorType.ACADEMIC_LAB ||
          (!result?.vendor_member?.vendor_company?.is_on_marketplace &&
            result?.vendor_member?.vendor_company?.skip_cda &&
            result?.vendor_member?.vendor_company?.skip_certification_tag &&
            result?.vendor_member?.vendor_company?.invited_by !== "admin")
        ) {
          return true;
        }
      }

      return false;
    },
    customer: async (parent, _, context) => {
      invariant(parent.id, "Missing user id.");
      return await context.prisma.customer.findFirst({
        where: {
          user_id: parent.id,
        },
      });
    },
    vendor_member: async (parent, _, context) => {
      invariant(parent.id, "Missing user id.");
      const vendorMember = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: parent.id,
        },
      });

      return vendorMember;
    },
    notifications: async (parent, _, context) => {
      invariant(parent.id, "Missing user id.");
      const notifications = await context.prisma.notification.findMany({
        where: {
          recipient_id: parent.id,
        },
      });

      return notifications;
    },
    has_setup_profile: async (parent, _, context) => {
      if (parent.customer?.has_setup_profile) {
        return parent.customer.has_setup_profile;
      }

      if (parent.vendor_member) {
        return !!parent.vendor_member.title ? true : false;
      }

      invariant(parent.id, "Missing user id.");

      const user = await context.prisma.user.findFirst({
        where: {
          id: parent.id,
        },
        include: {
          customer: {
            select: {
              has_setup_profile: true,
            },
          },
          vendor_member: {
            select: {
              title: true,
            },
          },
        },
      });

      if (user?.customer) {
        return user.customer.has_setup_profile;
      }

      if (user?.vendor_member) {
        return user.vendor_member.title ? true : false;
      }

      throw new InternalError("Missing user");
    },
    company_name: async (parent, _, context) => {
      if (parent.company_name) return parent.company_name;

      if (parent.customer?.biotech?.name) {
        return parent.customer.biotech.name;
      }
      if (parent.vendor_member?.vendor_company?.name) {
        return parent.vendor_member.vendor_company.name;
      }
      if (!parent.id) return null;

      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: parent.id,
        },
        include: {
          biotech: {
            select: {
              name: true,
            },
          },
        },
      });

      if (customer?.biotech.name) {
        return customer.biotech.name;
      }

      const vendorMember = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: parent.id,
        },
        include: {
          vendor_company: {
            select: {
              name: true,
            },
          },
        },
      });

      if (vendorMember?.vendor_company?.name) {
        return vendorMember.vendor_company.name;
      }

      throw new InternalError("Missing user.");
    },
    cda_url: async (parent, _, context) => {
      invariant(parent.id, "Missing user id.");

      const vendor = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: parent.id,
        },
      });

      try {
        if (vendor) {
          const user = await context.prisma.user.findFirstOrThrow({
            where: {
              id: context.req.user_id,
            },
            include: {
              vendor_member: {
                include: {
                  vendor_company: true,
                },
              },
            },
          });

          if (
            user.vendor_member?.vendor_company?.cda_pandadoc_file_id &&
            user.vendor_member?.vendor_company?.cda_pandadoc_signer
          ) {
            const viewDocSessionResponse =
              await createVendorCompanyViewCdaSession(
                user.vendor_member.vendor_company.cda_pandadoc_signer,
                user.vendor_member.vendor_company.cda_pandadoc_file_id
              );
            return `https://app.pandadoc.com/s/${viewDocSessionResponse.id}`;
          }
        } else {
          const user = await context.prisma.user.findFirstOrThrow({
            where: {
              id: parent.id,
            },
            include: {
              customer: {
                include: {
                  biotech: true,
                },
              },
            },
          });

          if (
            user.customer?.biotech.cda_pandadoc_file_id &&
            user.customer?.biotech.cda_pandadoc_signer
          ) {
            const viewDocSessionResponse = await createBiotechViewCdaSession(
              user.customer.biotech.cda_pandadoc_signer,
              user.customer.biotech.cda_pandadoc_file_id
            );
            return `https://app.pandadoc.com/s/${viewDocSessionResponse.id}`;
          }
        }

        return null;
      } catch (error) {
        return null;
      }
    },
    cda_signed_at: async (parent, _, context) => {
      if (parent.customer?.biotech?.cda_signed_at) {
        return parent.customer.biotech.cda_signed_at;
      }
      if (parent.vendor_member?.vendor_company?.cda_signed_at) {
        return parent.vendor_member.vendor_company.cda_signed_at;
      }

      invariant(parent.id, "Missing user id.");

      const vendor = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: parent.id,
        },
      });

      if (vendor) {
        const vendorMember = await context.prisma.vendorMember.findFirst({
          where: {
            user_id: parent.id,
          },
          include: {
            vendor_company: {
              select: {
                cda_signed_at: true,
              },
            },
          },
        });
        return vendorMember?.vendor_company?.cda_signed_at;
      } else {
        const customer = await context.prisma.customer.findFirst({
          where: {
            user_id: parent.id,
          },
          include: {
            biotech: {
              select: {
                cda_signed_at: true,
              },
            },
          },
        });
        return customer?.biotech?.cda_signed_at;
      }
    },
    skip_cda: async (parent, _, context) => {
      // gating this subscription to remove skip cda feature
      if (process.env.DISABLE_CDA === "true") {
        return null;
      } else {
        if (parent.customer?.biotech?.skip_cda) {
          return parent.customer.biotech.skip_cda;
        }
        if (parent.vendor_member?.vendor_company?.skip_cda) {
          return parent.vendor_member.vendor_company.skip_cda;
        }

        invariant(parent.id, "Missing user id.");

        const vendor = await context.prisma.vendorMember.findFirst({
          where: {
            user_id: parent.id,
          },
        });

        if (vendor) {
          const vendorMember = await context.prisma.vendorMember.findFirst({
            where: {
              user_id: parent.id,
            },
            include: {
              vendor_company: {
                select: {
                  skip_cda: true,
                },
              },
            },
          });
          return vendorMember?.vendor_company?.skip_cda as boolean;
        } else {
          const customer = await context.prisma.customer.findFirst({
            where: {
              user_id: parent.id,
            },
            include: {
              biotech: {
                select: {
                  skip_cda: true,
                },
              },
            },
          });
          return customer?.biotech?.skip_cda as boolean;
        }
      }
    },
    full_name: async (parent, args, context) => {
      return `${parent.first_name} ${parent.last_name}`;
    },
    company_collaborator_role: async (parent, args, context) => {
      if (parent.company_collaborator_role) {
        return parent.company_collaborator_role;
      }
      invariant(parent.id, "User id not found.");
      const user = await context.prisma.user.findFirst({
        where: {
          id: parent.id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });
      invariant(user, "User not found.");

      if (user.customer) {
        return user.customer.role;
      }
      if (user.vendor_member) {
        return user.vendor_member.role;
      }

      throw new InternalError("User company collaborator role not found.");
    },
  },
  Subscription: {
    cdaUrl: {
      // @ts-ignore
      subscribe: async (_, __, context) => {
        // gating this subscription to remove subscribe cda feature
        if (process.env.DISABLE_CDA === "true") {
          return null;
        } else {
          const vendor = await context.prisma.vendorMember.findFirst({
            where: {
              user_id: context.req.user_id,
            },
            include: {
              vendor_company: true,
            },
          });

          let channelId;
          if (vendor) {
            channelId = vendor.vendor_company?.id;
          } else {
            const customer = await context.prisma.customer.findFirstOrThrow({
              where: {
                user_id: context.req.user_id,
              },
              include: {
                biotech: true,
              },
            });

            channelId = customer.biotech.id;
          }

          const channel = `cdaUrl:${channelId}`;
          return context.pubsub.asyncIterator(channel);
        }
      },
    },
    cdaSignedAt: {
      // @ts-ignore
      subscribe: async (_, __, context) => {
        // gating this subscription to remove subscribe cda feature
        if (process.env.DISABLE_CDA === "true") {
          return null;
        } else {
          const vendor = await context.prisma.vendorMember.findFirst({
            where: {
              user_id: context.req.user_id,
            },
          });

          let channelId;
          if (vendor) {
            const vendor = await context.prisma.vendorMember.findFirstOrThrow({
              where: {
                user_id: context.req.user_id,
              },
              include: {
                vendor_company: true,
              },
            });

            channelId = vendor.vendor_company?.id;
          } else {
            const customer = await context.prisma.customer.findFirstOrThrow({
              where: {
                user_id: context.req.user_id,
              },
              include: {
                biotech: true,
              },
            });

            channelId = customer.biotech.id;
          }

          const channel = `cdaSignedAt:${channelId}`;
          return context.pubsub.asyncIterator(channel);
        }
      },
    },
  },
  Query: {
    user: async (_, __, context) => {
      return await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
      });
    },
  },
  Mutation: {
    signUpUser: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const user = await trx.user.findFirst({
          where: {
            email: args.email,
          },
        });

        invariant(!user, new PublicError("User already exists."));

        const biotech = await trx.biotech.findFirst({
          where: {
            name: {
              equals: args.company_name,
              mode: "insensitive",
            },
          },
        });

        invariant(
          !biotech,
          new PublicError(
            "Your company has already setup an account. Please ask any user from your account to invite you to the company account."
          )
        );

        const newBiotech = await trx.biotech.create({
          data: {
            name: args.company_name,
          },
        });

        const hashedPassword = await hashPassword(args.password);

        const newCreatedUser = await trx.user.create({
          data: {
            email: args.email,
            first_name: args.first_name,
            last_name: args.last_name,
            encrypted_password: hashedPassword,
            phone_number: args.phone_number,
            country_code: args.country_code,
          },
        });

        await trx.customer.create({
          data: {
            user_id: newCreatedUser.id,
            biotech_id: newBiotech.id,
            role: CompanyCollaboratorRoleType.OWNER,
          },
        });

        await addRoleForUser(newCreatedUser.id, CasbinRole.OWNER);

        // Genereate tokens
        const tokens = createTokens({ id: newCreatedUser.id });

        return {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        };
      });
    },
    signInUser: async (_, args, context) => {
      const { email, password } = args;
      let foundUser = await context.prisma.user.findFirst({
        where: {
          email,
        },
      });

      invariant(foundUser, new PublicError("User not found."));

      invariant(
        foundUser && foundUser.encrypted_password !== null,
        new PublicError(
          "User password not set, please proceed to forgot password to set a new password."
        )
      );

      invariant(
        foundUser.is_active === true,
        new PublicError("Your account has been suspended.")
      );

      const isPasswordMatched = await checkPassword(
        password,
        foundUser,
        context
      );
      invariant(
        isPasswordMatched === true,
        new PublicError("Invalid email or password.")
      );

      // Genereate tokens
      const tokens = createTokens({ id: foundUser.id });

      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      };
    },
    refreshJWT: async (_, args, context) => {
      // Get refresh token from header
      const authHeader = context.req.get("authorization");
      if (!authHeader) {
        return null;
      }
      const tokenArray = authHeader.split(" ");
      if (tokenArray.length !== 2) {
        return null;
      }
      const refreshToken = tokenArray[1];
      const { REFRESH_TOKEN_SECRET } = process.env;
      let userId;
      // Verify the refresh token
      try {
        const data = verify(
          refreshToken,
          REFRESH_TOKEN_SECRET || "secret"
        ) as Request;
        userId = data.user_id;
        if (userId) {
          const newTokens = createTokens({ id: userId });
          return {
            access_token: newTokens.accessToken,
            refresh_token: newTokens.refreshToken,
          };
        }

        // Invalid jwt token if user id not found
        throw new PublicError("Your session is expired.");
      } catch (error) {
        // If verify failed, meaning the session is no longer authenticated.
        throw new PublicError("Your session is expired.");
      }
    },
    forgotPassword: async (_, args, context) => {
      invariant(args.email, new InternalError("Missing argument: email."));

      const user = await context.prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });

      invariant(user, new PublicError("User not found."));

      const updatedUser = authService.forgotPassword(
        { email: args.email },
        { prisma: context.prisma }
      );

      if (!updatedUser) {
        return false;
      }
      return true;
    },
    resetPassword: async (_, args, context) => {
      invariant(
        args.reset_token,
        new InternalError("Missing argument: reset_token")
      );

      invariant(
        args.new_password,
        new InternalError("Missing argument: new_password")
      );

      const user = await context.prisma.user.findFirst({
        where: {
          reset_password_token: args.reset_token,
        },
      });

      invariant(
        user && user.reset_password_expiration,
        new PublicError("Invalid reset password link.")
      );

      const timeElapsed =
        user.reset_password_expiration.getTime() - new Date().getTime();

      invariant(
        timeElapsed <= 7 * 24 * 60 * 60 * 1000 && timeElapsed >= 0,
        new PublicError("The reset password link is expired.")
      );

      await context.prisma.user.update({
        where: {
          reset_password_token: args.reset_token,
        },
        data: {
          encrypted_password: await hashPassword(args.new_password),
          reset_password_token: null,
          reset_password_expiration: null,
        },
      });
      return true;
    },
    updateUserInfo: async (_, args, context) => {
      const user = await context.prisma.user.update({
        where: {
          id: context.req.user_id,
        },
        data: {
          first_name: args.first_name,
          last_name: args.last_name,
          email: args.email,
          phone_number: args.phone_number,
          country_code: args.country_code,
        },
      });

      return user;
    },
    createCda: async (_, __, context) => {
      // gating this mutation to remove create cda feature
      if (process.env.DISABLE_CDA === "true") {
        return null;
      } else {
        try {
          const vendor = await context.prisma.vendorMember.findFirst({
            where: {
              user_id: context.req.user_id,
            },
          });

          if (vendor) {
            await context.prisma.$transaction(async (trx) => {
              const user = await trx.user.findFirstOrThrow({
                where: {
                  id: context.req.user_id,
                },
                include: {
                  vendor_member: {
                    include: {
                      vendor_company: true,
                    },
                  },
                },
              });

              invariant(
                user.vendor_member,
                new PublicError("Vendor member not found.")
              );

              let cda_pandadoc_file_id =
                user?.vendor_member?.vendor_company?.cda_pandadoc_file_id;

              if (cda_pandadoc_file_id === null) {
                const docResponse = await createVendorCompanyCda(user);
                cda_pandadoc_file_id = docResponse.id as string;
              }

              return await trx.vendorCompany.update({
                where: {
                  id: user.vendor_member.vendor_company_id,
                },
                data: {
                  cda_pandadoc_file_id,
                  cda_pandadoc_signer: user.email,
                },
              });
            });
          } else {
            await context.prisma.$transaction(async (trx) => {
              const user = await trx.user.findFirstOrThrow({
                where: {
                  id: context.req.user_id,
                },
                include: {
                  customer: {
                    include: {
                      biotech: true,
                    },
                  },
                },
              });

              invariant(user.customer, new PublicError("Customer not found."));

              let cda_pandadoc_file_id =
                user?.customer?.biotech?.cda_pandadoc_file_id;

              if (cda_pandadoc_file_id === null) {
                const docResponse = await createBiotechCda(user);
                cda_pandadoc_file_id = docResponse.id as string;
              }

              return await context.prisma.biotech.update({
                where: {
                  id: user.customer.biotech_id,
                },
                data: {
                  cda_pandadoc_file_id,
                  cda_pandadoc_signer: user.email,
                },
              });
            });
          }
          return true;
        } catch (error) {
          return false;
        }
      }
    },
    skipCda: async (_, __, context) => {
      // gating this mutation to remove skip cda feature
      if (process.env.DISABLE_CDA === "true") {
        return null;
      } else {
        try {
          const vendor = await context.prisma.vendorMember.findFirst({
            where: {
              user_id: context.req.user_id,
            },
          });

          if (vendor) {
            await context.prisma.$transaction(async (trx) => {
              const user = await trx.user.findFirstOrThrow({
                where: {
                  id: context.req.user_id,
                },
                include: {
                  vendor_member: {
                    include: {
                      vendor_company: true,
                    },
                  },
                },
              });

              invariant(
                user.vendor_member,
                new PublicError("Vendor member not found.")
              );

              return await trx.vendorCompany.update({
                where: {
                  id: user.vendor_member.vendor_company_id,
                },
                data: {
                  skip_cda: true,
                },
              });
            });
          } else {
            await context.prisma.$transaction(async (trx) => {
              const user = await trx.user.findFirstOrThrow({
                where: {
                  id: context.req.user_id,
                },
                include: {
                  customer: {
                    include: {
                      biotech: true,
                    },
                  },
                },
              });

              invariant(user.customer, new PublicError("Customer not found."));

              return await context.prisma.biotech.update({
                where: {
                  id: user.customer.biotech_id,
                },
                data: {
                  skip_cda: true,
                },
              });
            });
          }
          return true;
        } catch (error) {
          return false;
        }
      }
    },
    addPhoneNumber: async (_, args, context) => {
      const { country_code, phone_number } = args;

      const userId = context.req.user_id;

      invariant(userId, "Missing user id");

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      invariant(currentUser, "User not found.");

      const updatedUser = await context.prisma.user.update({
        data: {
          phone_number,
          country_code,
        },
        where: {
          id: currentUser.id,
        },
      });

      return updatedUser;
    },
  },
};

export default resolvers;
