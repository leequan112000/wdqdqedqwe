import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import sourcererLiteService from '../../services/sourcererLite/sourcererLite.service';

const resolvers: Resolvers<Context> = {
  Query: {
    searchVendorByService: async (_, args, context) => {
      const { keyword, fingerprint, ip_address, first, after } = args;

      await sourcererLiteService.checkRateLimit(
        { keyword, fingerprint, ip_address },
        context,
      );

      const is_paid_user = await sourcererLiteService.checkIsPaidUser(context);

      return await sourcererLiteService.matchVendorByService(
        { keyword, first, after, is_paid_user },
        context,
      );
    },
    searchVendorByServices: async (_, args, context) => {
      const { subspecialty_ids, first, after } = args;

      const is_paid_user = await sourcererLiteService.checkIsPaidUser(context);

      return await sourcererLiteService.matchVendorByServices(
        { subspecialty_ids, first, after, is_paid_user },
        context,
      );
    },
  },
};

export default resolvers;
