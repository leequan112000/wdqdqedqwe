import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../../helper/pubsub";
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../../generated";
import { sendNewMessageNoticeEmailQueue } from "../../queues/mailer.queues";
import createMessageNotification from '../../notification/messageNotification';

const resolvers: Resolvers<Context> = {
  Message: {
    user: async (parent, _, context) => {
      if (!parent.user_id) {
        throw new InternalError('User id not found')
      }
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      })
    },
  },
  Mutation: {
    sendMessage: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        if (!context.req.user_id) {
          throw new PublicError('User not logged in.');
        }

        const customer = await context.prisma.customer.findFirst({
          where: {
            user_id: context.req.user_id,
          },
        });
  
        const projectConnection = await context.prisma.projectConnection.findFirst({
          where: {
            id: args.project_connection_id,
          },
          include: {
            customer_connections: true,
            vendor_member_connections: true,
          },
        });
        if (!projectConnection) {
          throw new InternalError('Project connection not found');
        }
  
        let users;
        if (customer) {
          // current user is customer, then users find vendor members
          const vendorMembers = await context.prisma.vendorMember.findMany({
            where: {
              id: {
                in: projectConnection.vendor_member_connections.map(vmc => vmc.vendor_member_id),
              },
            },
          });
          users = await context.prisma.user.findMany({
            where: {
              id: {
                in: vendorMembers.map(vm => vm.user_id),
              },
            },
          });
        } else {
          // current user is vendor member, then users find customers
          const customers = await context.prisma.vendorMember.findMany({
            where: {
              id: {
                in: projectConnection.customer_connections.map(cc => cc.customer_id),
              },
            },
          });
          users = await context.prisma.user.findMany({
            where: {
              id: {
                in: customers.map(c => c.user_id),
              },
            },
          });
        }

        let chat = await trx.chat.findFirst({
          where: {
            project_connection_id: args.project_connection_id,
          },
        });

        // Create chat if not exist.
        if (!chat) {
          const projectConnection = await trx.projectConnection.findFirst({
            where: {
              id: args.project_connection_id,
            },
            include: {
              vendor_company: true,
              project_request: {
                select: {
                  biotech_id: true,
                },
              },
            },
          });
          if (!projectConnection) {
            throw new InternalError('Project connection not found.')
          }
          chat = await trx.chat.create({
            data: {
              biotech_id: projectConnection.project_request.biotech_id,
              vendor_company_id: projectConnection.vendor_company_id,
              project_connection_id: projectConnection.id,
            },
          })
        }

        const newMessage = await trx.message.create({
          data: {
            content: args.content,
            chat_id: chat.id,
            user_id: context.req.user_id
          }
        });

        pubsub.publish('NEW_MESSAGE', { newMessage });

        sendNewMessageNoticeEmailQueue.add({
          projectConnectionId: chat.project_connection_id,
          senderUserId: context.req.user_id,
        });

        await Promise.all(
          users.map(async (user) => {
            const notification = await context.prisma.notification.findFirst({
              where: {
                recipient_id: user.id,
                notification_type: 'MessageNotification',
                read_at: null,
                params: {
                  path: ['project_connection_id'],
                  equals: projectConnection.id,
                },
              }
            });

            if (!notification) {
              createMessageNotification(context.req.user_id!, user.id, projectConnection.id);
            }
          })
        );

        return newMessage;
      });
    },
  },
  Subscription: {
    newMessage: {
      // @ts-ignore
      subscribe: withFilter(
        () => pubsub.asyncIterator<any>(['NEW_MESSAGE']),
        (payload, variables) => {
          return (
            payload.newMessage.chat_id === variables.chat_id
          );
        },
      ),
    },
  },
};

export default resolvers;
