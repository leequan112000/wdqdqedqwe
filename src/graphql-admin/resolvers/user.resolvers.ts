import userService from '../../services/user/user.service';
import { Resolvers } from '../generated';
import { Context } from '../../types/context';

const resolver: Resolvers<Context> = {
  User: {
    customer: async (parent, _, context) => {
      if (parent.customer) return parent.customer;

      if (!parent.id) return null;

      return await context.prisma.customer.findUnique({
        where: {
          user_id: parent.id,
        },
      });
    },
    vendor_member: async (parent, _, context) => {
      if (parent.vendor_member) return parent.vendor_member;

      if (!parent.id) return null;

      return await context.prisma.vendorMember.findUnique({
        where: {
          user_id: parent.id,
        },
      });
    },
    sourcerer_vendor_profile: async (parent, _, context) => {
      if (parent.sourcerer_vendor_profile)
        return parent.sourcerer_vendor_profile;

      if (!parent.id) return null;

      return await context.prisma.vendor.findUnique({
        where: {
          user_id: parent.id,
        },
      });
    },
  },
  Query: {
    users: async (_, __, context) => {
      return await context.prisma.user.findMany();
    },
  },
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
