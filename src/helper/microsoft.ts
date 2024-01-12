import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import { Client } from '@microsoft/microsoft-graph-client';
import ClientOAuth2 from 'client-oauth2';
import { app_env } from '../environment';
import prisma from '../prisma';
import { OauthProvider } from './constant';

export const microsoftClient = new ClientOAuth2({
  clientId: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  accessTokenUri: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  authorizationUri: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  redirectUri: `${app_env.SERVER_URL}/auth/microsoft/callback`,
});

export const microsoftGraphClient = (token: string) => {
  return Client.init({
    authProvider: (done) => {
      done(null, token);
    },
  });
}

export const microsoftClientRefreshToken = async (
  access_token: string,
  refresh_token: string,
  user_id: string,
) => {
  var token = microsoftClient.createToken(access_token, refresh_token, { user_id })
  const newToken = await token.refresh();
  await prisma.oauth.upsert({
    where: {
      user_id_provider: {
        user_id,
        provider: OauthProvider.MICROSOFT,
      }
    },
    create: {
      user_id,
      provider: OauthProvider.MICROSOFT,
      access_token: newToken.accessToken,
      refresh_token: newToken.refreshToken,
    },
    update: {
      user_id,
      provider: OauthProvider.MICROSOFT,
      access_token: newToken.accessToken,
      refresh_token: newToken.refreshToken,
    },
  });

  return newToken;
}

export const createMicrosoftEvent = async (client: Client, eventDetails: MicrosoftGraph.Event): Promise<MicrosoftGraph.Event> => {
  return await client
    .api("/me/events")
    .post(eventDetails);
}

export const patchMicrosoftEvent = async (client: Client, eventDetails: MicrosoftGraph.Event): Promise<MicrosoftGraph.Event> => {
  return await client
    .api(`/me/events/${eventDetails.id}`)
    .patch(eventDetails);
}

export const deleteMicrosoftEvent = async (client: Client, eventDetails: MicrosoftGraph.Event) => {
  return await client
    .api(`/me/events/${eventDetails.id}`)
    .delete();
}
