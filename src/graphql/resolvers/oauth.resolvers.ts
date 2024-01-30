import { Context } from "../../types/context";
import { Resolvers } from "../generated";

import { disconnectGoogleOauth2, googleApiClient } from "../../helper/googleCalendar";
import { OauthProvider } from "../../helper/constant";
import invariant from "../../helper/invariant";

import { PublicError } from "../errors/PublicError";

const resolvers: Resolvers<Context> = {
  Mutation: {
    disconnectOauth2: async (_, args, context) => {
      const { provider } = args;
      const { user_id } = context.req;
      invariant(user_id, "User ID not found.");

      invariant((Object.values(OauthProvider) as string[]).includes(provider), new PublicError("Invalid Oauth2 Provider"));

      const oauth = await context.prisma.oauth.findFirst({
        where: {
          user_id,
          provider,
        },
      });

      invariant(oauth, new PublicError("User not connected!"));

      return await context.prisma.$transaction(async (trx) => {
        try {
          switch (provider) {
            case OauthProvider.GOOGLE: {
              const client = googleApiClient(oauth.access_token, oauth.refresh_token);
              await disconnectGoogleOauth2(client, oauth.access_token);
            }
            case OauthProvider.MICROSOFT:
              // Microsoft does not provide revoke token API
              break;
            default:
              throw new PublicError("Invalid Oauth2 Provider");
          }

          await trx.oauth.delete({
            where: {
              id: oauth.id
            }
          });

          return true;
        } catch (error: any) {
          throw new PublicError("Something went wrong disconnecting");
        }
      });
    },
  },
};

export default resolvers;
