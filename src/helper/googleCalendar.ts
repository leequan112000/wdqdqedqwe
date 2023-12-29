import ClientOAuth2 from 'client-oauth2';
import { OAuth2Client as GoogleOAuth2Client } from 'google-auth-library';
import { calendar } from '@googleapis/calendar';
import { v4 as uuidv4 } from 'uuid';
import { JWT } from 'google-auth-library'
import { app_env } from '../environment';

export const googleClient = new ClientOAuth2({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  accessTokenUri: 'https://oauth2.googleapis.com/token',
  authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
  redirectUri: `${app_env.SERVER_URL}/auth/google/callback`,
});

export const googleApiClient = (access_token: string, refresh_token: string) => {
  const googleApiClient = new GoogleOAuth2Client(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    `${app_env.SERVER_URL}/auth/google/callback`
  );

  googleApiClient.setCredentials({
    access_token,
    refresh_token,
  });

  return googleApiClient;
}

const client = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL!,
  key: process.env.GOOGLE_PRIVATE_KEY!.split(String.raw`\n`).join('\n'),
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
  keyId: process.env.GOOGLE_CLIENT_ID!,
  subject: process.env.GOOGLE_CALENDAR_ID!,
});

type GEvent = {
  summary?: string;
  description?: string | null;
  start?: {
    dateTime: string;
    timeZone: string;
  };
  end?: {
    dateTime: string;
    timeZone: string;
  };
  reminders?: {
    useDefault: boolean;
    overrides: [{ method: 'popup' | 'email'; minutes: number }];
  };
  attendees?: Array<{ email: string; comment?: string }>;
}

export const listGoogleEvents = async (googleApiClient: GoogleOAuth2Client, singleEvents: boolean, startDateIso: string, endDateIso?: string) => {
  try {
    const response = await calendar({ version: 'v3', auth: googleApiClient }).events.list({
      calendarId: 'primary',
      timeMin: startDateIso,
      ...(endDateIso ? { timeMax: endDateIso, } : {}),
      singleEvents,
    });

    const events = response.data.items;
    return Array.isArray(events) ? events : [];
  } catch (error) {
    throw error;
  }
}

export const createGoogleEvent = async (googleApiClient: GoogleOAuth2Client, gEvent: GEvent) => {
  return await calendar({ version: 'v3', auth: googleApiClient}).events.insert({
    calendarId: 'primary',
    requestBody: {
      ...gEvent,
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
        entryPoints: [
          { entryPointType: 'video' },
        ],
      },
      guestsCanSeeOtherGuests: false,
      guestsCanModify: false,
      guestsCanInviteOthers: false,
    },
    sendUpdates: 'all',
    conferenceDataVersion: 1,
  });
}

export const patchGoogleEvent = async (eventId: string, gEvent: GEvent, sendUpdates = false) => {
  return await calendar('v3').events.patch({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    eventId,
    auth: client,
    requestBody: {
      ...gEvent,
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
        entryPoints: [
          { entryPointType: 'video' },
        ],
      },
      guestsCanSeeOtherGuests: false,
      guestsCanModify: false,
      guestsCanInviteOthers: false,
    },
    sendUpdates: sendUpdates ? 'all' : 'none',
    conferenceDataVersion: 1,
  });
}

export const cancelGoogleEvent = async (eventId: string) => {
  return await calendar('v3').events.patch({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    eventId,
    auth: client,
    requestBody: {
      status: 'cancelled',
    },
    sendUpdates: 'none',
  })
}
