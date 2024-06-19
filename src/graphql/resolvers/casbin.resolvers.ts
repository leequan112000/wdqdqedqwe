import { frontendPermissionObject } from '../../helper/casbin';
import { Resolvers } from '../generated';
import { Context } from '../../types/context';
import { InternalError } from '../errors/InternalError';

const resolvers: Resolvers<Context> = {
  Query: {
    casbinPermission: async (_, __, context) => {
      const userId = context.req.user_id;
      if (!userId) {
        throw new InternalError('User id not found');
      }

      const obj = await frontendPermissionObject(userId);
      return JSON.stringify(obj);
    },
  },
};

export default resolvers;
