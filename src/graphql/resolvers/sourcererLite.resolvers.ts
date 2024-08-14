import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import sourcererLiteService from '../../services/sourcererLite/sourcererLite.service';

const resolvers: Resolvers<Context> = {
  Query: {
    sourcererLiteSearch: async (_, args, context) => {
      const { keyword, fingerprint, ip_address, first, after } = args;

      await sourcererLiteService.checkRateLimit(
        { keyword, fingerprint, ip_address },
        context,
      );

      const is_paid_user = await sourcererLiteService.checkIsPaidUser(context);

      const isSubspecialtyExist =
        await context.prismaCRODb.subspecialty.findFirst({
          where: {
            name: keyword,
          },
        });

      if (!isSubspecialtyExist) {
        const subspecialties =
          (await sourcererLiteService.searchSubspecialtiesSemantically({
            search_term: keyword,
          })) as { id: string; name: string }[];

        const subspecialty_ids = subspecialties.map((s) => s.id);
        const subspecialty_names = subspecialties.map((s) => s.name);

        let did_you_mean_suggestion = '';
        if (subspecialty_ids.length > 0) {
          did_you_mean_suggestion = await sourcererLiteService.checkSpelling({
            keyword,
          });
        }

        const result = await sourcererLiteService.matchVendorByServices(
          { subspecialty_ids, subspecialty_names, first, after, is_paid_user },
          context,
        );

        return {
          ...result,
          did_you_mean_suggestion,
        };
      }

      return await sourcererLiteService.matchVendorByService(
        { keyword, first, after, is_paid_user },
        context,
      );
    },
  },
};

export default resolvers;
