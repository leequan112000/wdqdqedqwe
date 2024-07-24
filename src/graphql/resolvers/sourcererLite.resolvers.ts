import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import sourcererLiteService from '../../services/sourcererLite/sourcererLite.services';
import {
  CustomerSubscriptionPlanName,
  SubscriptionStatus,
} from '../../helper/constant';

const resolvers: Resolvers<Context> = {
  Query: {
    searchVendorByService: async (_, args, context) => {
      const { keyword, fingerprint, ip_address, first, after } = args;
      const userId = context.req.user_id;

      await sourcererLiteService.checkRateLimit(
        { keyword, fingerprint, ip_address },
        context,
      );

      let isPaidUser = false;
      if (userId) {
        const customer = (
          await context.prisma.user.findUnique({
            where: { id: userId },
            include: {
              customer: {
                include: {
                  biotech: {
                    include: {
                      subscriptions: {
                        where: {
                          status: SubscriptionStatus.ACTIVE,
                          OR: [
                            { ended_at: null },
                            {
                              ended_at: {
                                gt: new Date(),
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  customer_subscriptions: {
                    where: {
                      status: SubscriptionStatus.ACTIVE,
                      plan_name: {
                        in: [
                          CustomerSubscriptionPlanName.SOURCING_PLAN,
                          CustomerSubscriptionPlanName.WHITE_GLOVE_PLAN,
                        ],
                      },
                    },
                  },
                },
              },
            },
          })
        )?.customer;
        const has_active_legacy_plan =
          !!customer?.biotech?.subscriptions &&
          customer?.biotech?.subscriptions.length > 0;
        const has_active_sourcerer_or_white_glove_plan =
          !!customer?.customer_subscriptions &&
          customer?.customer_subscriptions.length > 0;
        isPaidUser =
          has_active_legacy_plan || has_active_sourcerer_or_white_glove_plan;
      }

      return await sourcererLiteService.matchVendorByService(
        { keyword, first, after, is_paid_user: isPaidUser },
        context,
      );
    },
  },
};

export default resolvers;
