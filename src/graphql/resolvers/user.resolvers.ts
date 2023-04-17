import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { checkPassword, createTokens, hashPassword, createResetPasswordToken } from "../../helper/auth";
import { createBiotechCda, createBiotechViewCdaSession, createVendorCompanyCda, createVendorCompanyViewCdaSession } from "../../helper/pandadoc";
import { verify } from "jsonwebtoken";
import { Request } from "express";
import { sendResetPasswordEmail } from "../../mailer/user";
import { Resolvers } from "../../generated";
import { InternalError } from "../errors/InternalError";

const resolvers: Resolvers<Context> = {
  User: {
    user_type: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Missing user id.')
      }
      const vendor = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: parent.id
        }
      });
      return vendor ? 'vendor' : 'customer';
    },
    has_completed_onboarding: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Missing user id.')
      }
      const result = await context.prisma.user.findFirst({
        where: {
          id: parent.id,
        },
        include: {
          customer: {
            include: {
              biotech: true
            }
          },
          vendor_member: {
            include: {
              vendor_company: true,
            },
          },
        },
      });

      if (result?.vendor_member && !result.vendor_member.title) {
        return false
      }

      if (result?.customer && !result.customer.job_title) {
        return false
      }

      if (result?.customer?.biotech?.cda_signed_at || result?.vendor_member?.vendor_company?.cda_signed_at) {
        return true;
      }

      return false;
    },
    customer: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Missing user id.')
      }
      return await context.prisma.customer.findFirst({
        where: {
          user_id: parent.id
        }
      })
    },
    vendor_member: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Missing user id.')
      }
      const vendorMember = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: parent.id
        }
      })

      if (!vendorMember) {
        throw new InternalError('Vendor member not found.')
      }

      return vendorMember;
    },
    notifications: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Missing user id.')
      }
      const notifications = await context.prisma.notification.findMany({
        where: {
          recipient_id: parent.id
        }
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

      if (!parent.id) {
        throw new InternalError('Missing user id.')
      }

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

      throw new InternalError('Missing user');
    },
    company_name: async (parent, _, context) => {
      if (parent.customer?.biotech?.name) {
        return parent.customer.biotech.name;
      }
      if (parent.vendor_member?.vendor_company?.name) {
        return parent.vendor_member.vendor_company.name;
      }

      if (!parent.id) {
        throw new InternalError('Missing user id');
      }

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

      throw new InternalError('Missing user.')
    },
    cda_url: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Missing user id');
      }

      const vendor = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: parent.id
        }
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
                  vendor_company: true
                }
              }
            }
          });

          if (user.vendor_member?.vendor_company?.cda_pandadoc_file_id) {
            const viewDocSessionResponse = await createVendorCompanyViewCdaSession(user.email, user.vendor_member?.vendor_company?.cda_pandadoc_file_id);
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
                  biotech: true
                }
              }
            }
          });

          if (user.customer?.biotech.cda_pandadoc_file_id) {
            const viewDocSessionResponse = await createBiotechViewCdaSession(user.email, user.customer.biotech.cda_pandadoc_file_id);
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

      if (!parent.id) {
        throw new InternalError('Missing user id');
      }

      const vendor = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: parent.id
        }
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
    full_name: async (parent, args, context) => {
      return `${parent.first_name} ${parent.last_name}`;
    }
  },
  Subscription: {
    cdaUrl: {
      // @ts-ignore
      subscribe: async (_, __, context) => {
        const vendor = await context.prisma.vendorMember.findFirst({
          where: {
            user_id: context.req.user_id
          }
        });

        let channelId;
        if (vendor) {
          const vendor = await context.prisma.vendorMember.findFirstOrThrow({
            where: {
              user_id: context.req.user_id,
            },
            include: {
              vendor_company: true
            }
          });

          channelId = vendor.vendor_company?.id;
        } else {
          const customer = await context.prisma.customer.findFirstOrThrow({
            where: {
              user_id: context.req.user_id,
            },
            include: {
              biotech: true
            }
          });

          channelId = customer.biotech.id;
        }

        const channel = `cdaUrl:${channelId}`;
        return context.pubsub.asyncIterator(channel);
      },
    },
    cdaSignedAt: {
      // @ts-ignore
      subscribe: async (_, __, context) => {
        const vendor = await context.prisma.vendorMember.findFirst({
          where: {
            user_id: context.req.user_id
          }
        });

        let channelId;
        if (vendor) {
          const vendor = await context.prisma.vendorMember.findFirstOrThrow({
            where: {
              user_id: context.req.user_id,
            },
            include: {
              vendor_company: true
            }
          });

          channelId = vendor.vendor_company?.id;
        } else {
          const customer = await context.prisma.customer.findFirstOrThrow({
            where: {
              user_id: context.req.user_id,
            },
            include: {
              biotech: true
            }
          });

          channelId = customer.biotech.id;
        }

        const channel = `cdaSignedAt:${channelId}`;
        return context.pubsub.asyncIterator(channel);
      },
    },
  },
  Query: {
    user: async (_, __, context) => {
      return await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id
        }
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
        })

        if (user) {
          throw new PublicError('User already exist');
        }

        const biotech = await trx.biotech.findFirst({
          where: {
            name: {
              equals: args.company_name,
              mode: 'insensitive',
            }
          }
        });

        if (biotech) {
          throw new PublicError('Your company has already setup an account. Please ask any user from your account to invite you to the company account.');
        }

        const newBiotech = await trx.biotech.create({
          data: {
            name: args.company_name,
          }
        });

        const hashedPassword = await hashPassword(args.password);

        const newCreatedUser = await trx.user.create({
          data: {
            email: args.email,
            first_name: args.first_name,
            last_name: args.last_name,
            encrypted_password: hashedPassword,
          }
        });

        await trx.customer.create({
          data: {
            user_id: newCreatedUser.id,
            biotech_id: newBiotech.id,
          }
        });

        // Genereate tokens
        const tokens = createTokens({ id: newCreatedUser.id });

        return {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        };
      });
    },
    signInUser: async (_, args, context) => {
      let foundUser = await context.prisma.user.findFirst({
        where: {
          email: args.email
        }
      });

      if (!foundUser) {
        throw new PublicError('User not found.');
      }

      if (foundUser && foundUser.encrypted_password === null) {
        throw new PublicError('User password not set, please proceed to forgot password to set a new password');
      }

      const isPasswordMatched = await checkPassword(args.password, foundUser.encrypted_password!);
      if (isPasswordMatched === true) {
        // Genereate tokens
        const tokens = createTokens({ id: foundUser.id, });

        return {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        };
      }
      throw new PublicError('Invalid email or password.');
    },
    refreshJWT: async (_, args, context) => {
      // Get refresh token from header
      const authHeader = context.req.get('authorization');
      if (!authHeader) {
        return null;
      }
      const tokenArray = authHeader.split(' ');
      if (tokenArray.length !== 2) {
        return null;
      }
      const refreshToken = tokenArray[1];
      const { REFRESH_TOKEN_SECRET } = process.env;
      let userId;
      // Verify the refresh token
      try {
        const data = verify(refreshToken, REFRESH_TOKEN_SECRET || "secret") as Request;
        userId = data.user_id;
        if (userId) {
          const newTokens = createTokens({ id: userId });
          return {
            access_token: newTokens.accessToken,
            refresh_token: newTokens.refreshToken,
          };
        }

        // Invalid jwt token if user id not found
        throw new PublicError('Your session is expired.');
      } catch (error) {
        // If verify failed, meaning the session is no longer authenticated.
        throw new PublicError('Your session is expired.');
      }
    },
    forgotPassword: async (_, args, context) => {
      if (!args.email) {
        throw new InternalError('Missing argument: email')
      }
      const resetTokenExpiration = new Date().getTime() + 60 * 60 * 1000;

      const user = await context.prisma.user.update({
        where: {
          email: args.email,
        },
        data: {
          reset_password_token: createResetPasswordToken(),
          reset_password_expiration: new Date(resetTokenExpiration),
        },
      });

      if (!user) {
        return false;
      }
      sendResetPasswordEmail(user);
      return true;
    },
    resetPassword: async (_, args, context) => {
      if (!args.reset_token) {
        throw new InternalError('Missing argument: reset_token')
      }
      if (!args.new_password) {
        throw new InternalError('Missing argument: new_password')
      }
      const user = await context.prisma.user.findFirst({
        where: {
          reset_password_token: args.reset_token
        }
      });

      if (!user || !user.reset_password_expiration) {
        throw new PublicError('Invalid reset password link.')
      }

      const timeElapsed = user.reset_password_expiration.getTime() - new Date().getTime();

      if (timeElapsed <= 60 * 60 * 1000 && timeElapsed >= 0) {
        await context.prisma.user.update({
          where: {
            reset_password_token: args.reset_token
          },
          data: {
            encrypted_password: await hashPassword(args.new_password),
            reset_password_token: null,
            reset_password_expiration: null,
          },
        });
        return true;
      }
      throw new PublicError('The reset password link is expired.')
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
        },
      });

      return user;
    },
    createCda: async (_, __, context) => {
      try {
        const vendor = await context.prisma.vendorMember.findFirst({
          where: {
            user_id: context.req.user_id
          }
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
                    vendor_company: true
                  }
                }
              }
            });

            if (!user.vendor_member) {
              throw new PublicError('Vendor member not found.');
            }

            let cda_pandadoc_file_id = user?.vendor_member?.vendor_company?.cda_pandadoc_file_id;

            if (cda_pandadoc_file_id === null) {
              const docResponse = await createVendorCompanyCda(user);
              cda_pandadoc_file_id = docResponse.id as string;
            }

            return await trx.vendorCompany.update({
              where: {
                id: user.vendor_member.vendor_company_id
              },
              data: {
                cda_pandadoc_file_id,
              }
            })
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
                    biotech: true
                  }
                }
              }
            });

            if (!user.customer) {
              throw new PublicError('Customer not found.');
            }

            let cda_pandadoc_file_id = user?.customer?.biotech?.cda_pandadoc_file_id;

            if (cda_pandadoc_file_id === null) {
              const docResponse = await createBiotechCda(user);
              cda_pandadoc_file_id = docResponse.id as string;
            }

            return await context.prisma.biotech.update({
              where: {
                id: user.customer.biotech_id
              },
              data: {
                cda_pandadoc_file_id,
              }
            })
          });
        }
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};

export default resolvers;
