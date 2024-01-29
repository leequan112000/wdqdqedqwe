import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import { Client } from '@microsoft/microsoft-graph-client';
import ClientOAuth2 from 'client-oauth2';
import { app_env } from '../environment';

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

export const getMicrosoftUserInfo = async (client: Client, select: string | undefined = undefined): Promise<MicrosoftGraph.User> => {
  let req = client.api('/me');

  if (select) {
    req = req.select(select);
  }
  return await req.get();
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
