import userService from '../../services/user/user.service';
import { Resolvers } from '../generated';
import { Context } from '../../types/context';

const resolver: Resolvers<Context> = {
  Mutation: {
    purgeTestDataByUser: async (_, args, context) => {
      const { user_id } = args;

      return await context.prisma.$transaction(
        async (trx) => {
          return userService.purgeTestDataByUser(
            {
              user_id,
            },
            {
              prisma: trx,
            },
          );
        },
        {
          maxWait: 10000,
          timeout: 40000,
        },
      );
    },
    unregisterBiotechAccount: async (_, args, context) => {
      const { biotech_id } = args;

      return await context.prisma.$transaction(async (trx) => {
        return userService.unregisterBiotechAccount(
          {
            biotech_id,
          },
          {
            prisma: trx,
          },
        );
      });
    },
  },
};

export default resolver;
