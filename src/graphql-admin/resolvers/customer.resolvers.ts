import { PublicError } from '../../graphql/errors/PublicError';
import { Resolvers } from "../generated";
import { Context } from '../../types/context';
import { createResetPasswordToken } from '../../helper/auth';
import invariant from '../../helper/invariant';
import { sendCustomerInvitationByAdminEmail } from '../../mailer/customer';
import { CasbinRole, CompanyCollaboratorRoleType } from '../../helper/constant';
import collaboratorService from '../../services/collaborator/collaborator.service';
import { addRoleForUser } from '../../helper/casbin';

const resolver: Resolvers<Context> = {
  Customer: {
    user: async (parent, _, context) => {
      invariant(parent.user_id, 'User id not found.')
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      })
    },
  },
  Query: {
    _dummy: () => 'admin graphql',
  },
  Mutation: {
    inviteCustomerByAdmin: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const { first_name, last_name, email, biotech_id, role } = args;

        const user = await trx.user.findFirst({
          where: {
            email: email,
          },
        });

        invariant(user === null, new PublicError('User already exist.'));

        const owner = await trx.customer.findFirst({
          where: {
            role: CompanyCollaboratorRoleType.OWNER,
            biotech_id: biotech_id,
          },
        });
        const noOwner = owner === null;

        // Check if company has owner.
        invariant(
          role === CompanyCollaboratorRoleType.OWNER && noOwner
          || role !== CompanyCollaboratorRoleType.OWNER,
          new PublicError('Owner already exists!'),
        );

        const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        const newUser = await trx.user.create({
          data: {
            email: email,
            first_name: first_name,
            last_name: last_name,
            reset_password_token: createResetPasswordToken(),
            reset_password_expiration: new Date(resetTokenExpiration),
          },
        });

        const newCustomer = await trx.customer.create({
          data: {
            user_id: newUser.id,
            biotech_id: biotech_id,
          },
        });

        switch (role) {
          case CompanyCollaboratorRoleType.ADMIN: {
            await collaboratorService.setCustomerAsAdmin(
              {
                user_id: newUser.id,
                biotech_id: biotech_id,
                customer_id: newCustomer.id,
              },
              { prisma: trx }
            );
            break;
          }
          case CompanyCollaboratorRoleType.USER: {
            await collaboratorService.setCustomerAsUser(
              {
                customer_id: newCustomer.id,
              },
              { prisma: trx }
            );
            break;
          }
          case CompanyCollaboratorRoleType.OWNER: {
            await trx.customer.update({
              where: {
                id: newCustomer.id,
              },
              data: {
                role: CompanyCollaboratorRoleType.OWNER,
              },
            });
            await addRoleForUser(newUser.id, CasbinRole.OWNER);
            break;
          }
          default:
            throw new PublicError('Invalid role.');
        }

        sendCustomerInvitationByAdminEmail(newUser);
        return newCustomer;
      });
    },
  }
}

export default resolver;
