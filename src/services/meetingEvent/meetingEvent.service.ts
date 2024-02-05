import moment from "moment-timezone";
import type { GaxiosResponse} from 'googleapis-common';
import type { calendar_v3 } from '@googleapis/calendar'
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"

import invariant from "../../helper/invariant";
import { createMicrosoftEvent, deleteMicrosoftEvent, microsoftClient, microsoftGraphClient, patchMicrosoftEvent } from "../../helper/microsoft";
import { GEvent, createGoogleEvent, deleteGoogleEvent, googleApiClient, googleClient, listGoogleEvents, patchGoogleEvent } from "../../helper/googleCalendar";
import { MeetingGuestStatus, MeetingGuestType, MeetingPlatform, OauthProvider } from "../../helper/constant";
import { createNewMeetingNotificationJob, createRemoveMeetingNotificationJob, createUpdateMeetingNotificationJob } from "../../notification/meetingNotification";
import { createNotificationQueueJob } from "../../queues/notification.queues";
import { find } from "lodash";
import { ServiceContext } from "../../types/context";
import { MicrosoftCalendarEvent } from "../../types/microsoft";
import { CalendarEvent } from "../../graphql/generated";
import { PublicError } from "../../graphql/errors/PublicError";
import { checkIfUserInProjectConnection } from "../projectConnection/projectConnection.service";
import { meetingInvitationForCromaticUserWithinProjectEmail, meetingInvitationForGuestEmail } from "../../mailer/guestMeeting";
import { newMeetingNotificationEmail, updatedMeetingNotificationEmail } from "../../mailer/meetingEvent";
import { app_env } from "../../environment";
import { refreshToken } from "../../helper/clientOauth2";
import { InternalError } from "../../graphql/errors/InternalError";
import { MeetingEvent, ProjectConnection, ProjectRequest } from "@prisma/client";
import { NoOAuthError } from "../../graphql/errors/NoOAuthError";
import Sentry from "../../sentry";

const isGoogleExpiredError = (error: any) => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 401
  );
};

const isGoogleEventDeletedError = (error: any) => {
  return (
    typeof error === 'object' &&
    error !== null &&
    "code" in error &&
    error.code === 410
  );
}

const isMicrosoftExpiredError = (error: any) => {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    error.statusCode === 401
  );
};

type RefreshTokenArgs = {
  access_token: string;
  refresh_token: string;
  user_id: string;
}

const refreshMicrosoftToken = async (args: RefreshTokenArgs, ctx: ServiceContext) => {
  const { access_token, refresh_token, user_id } = args;
  const newToken = await refreshToken({ access_token,  refresh_token,  user_id, client: microsoftClient  })
  await ctx.prisma.oauth.upsert({
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

const refreshGoogleToken = async (args: RefreshTokenArgs, ctx: ServiceContext) => {
  const { access_token, refresh_token, user_id } = args;
  const newToken = await refreshToken({ access_token, refresh_token, user_id, client: googleClient });
  await ctx.prisma.oauth.upsert({
    where: {
      user_id_provider: {
        user_id,
        provider: OauthProvider.GOOGLE,
      }
    },
    create: {
      user_id,
      provider: OauthProvider.GOOGLE,
      access_token: newToken.accessToken,
      refresh_token: newToken.refreshToken,
    },
    update: {
      user_id,
      provider: OauthProvider.GOOGLE,
      access_token: newToken.accessToken,
      refresh_token: newToken.refreshToken,
    },
  });
  return newToken;
}

type SafePatchGoogleEventArgs = {
  access_token: string;
  refresh_token: string;
  g_event: GEvent,
  send_updates: boolean;
  platform_event_id: string;
  organizer_user_id: string;
}

const safePatchGoogleEvent = async (args: SafePatchGoogleEventArgs, ctx: ServiceContext) => {
  const { access_token, g_event, refresh_token, platform_event_id, send_updates, organizer_user_id } = args;
  const client = googleApiClient(access_token, refresh_token);
  try {
    return await patchGoogleEvent(
      client,
      platform_event_id,
      g_event,
      send_updates,
    );
  } catch (error) {
    if (isGoogleExpiredError(error)) {
      const newToken = await refreshGoogleToken(
        {
          access_token,
          refresh_token,
          user_id: organizer_user_id,
        },
        ctx
      );
      client.setCredentials({ access_token: newToken.accessToken, refresh_token: newToken.refreshToken });
      return await patchGoogleEvent(
        client,
        platform_event_id,
        g_event,
        send_updates,
      );
    } else {
      throw error;
    }
  }
}

type SafePatchMicrosoftEventArgs = {
  access_token: string;
  refresh_token: string;
  event_data: MicrosoftGraph.Event,
  organizer_user_id: string;
}

const safePatchMicrosoftEvent = async (args: SafePatchMicrosoftEventArgs, ctx: ServiceContext) => {
  const { access_token, refresh_token, event_data, organizer_user_id } = args;
  const client = microsoftGraphClient(access_token);
  try {
    return await patchMicrosoftEvent(client, event_data);
  } catch (error) {
    if (isMicrosoftExpiredError(error)) {
      const newToken = await refreshMicrosoftToken(
        {
          access_token,
          refresh_token,
          user_id: organizer_user_id,
        },
        ctx
      );
      const newClient = microsoftGraphClient(newToken.accessToken);
      return await patchMicrosoftEvent(newClient, event_data);
    } else {
      throw error;
    }
  }
}

type CreateMeetingEventOnCalendarAppArgs = {
  platform: string;
  organizer_user_id: string;
  all_participants_emails: Array<string>;
  start_time: string;
  end_time: string;
  timezone: string;
  title: string;
  description?: string;
}

const createMeetingEventOnCalendarApp = async (
  args: CreateMeetingEventOnCalendarAppArgs,
  ctx: ServiceContext,
) => {
  const {
    organizer_user_id, platform, all_participants_emails,
    description, end_time, start_time, timezone, title  } = args;
  let meeting_link = null;
  let phone_pin = null;
  let phone = null;
  let phone_country = null;
  let platform_event_id = null;

  switch (platform) {
    case MeetingPlatform.GOOGLE_MEET: {
      const oauthGoogle = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: organizer_user_id,
          provider: OauthProvider.GOOGLE,
        },
      });

      invariant(oauthGoogle, new PublicError('Not connected to Google'));

      const client = googleApiClient(oauthGoogle.access_token, oauthGoogle.refresh_token);

      let response: GaxiosResponse<calendar_v3.Schema$Event> | undefined = undefined;
      try {
        response = await createGoogleEvent(client, {
          summary: title,
          description,
          attendees: all_participants_emails.map((email) => ({ email })),
          end: {
            dateTime: end_time,
            timeZone: timezone,
          },
          start: {
            dateTime: start_time,
            timeZone: timezone,
          },
        });
      } catch (error) {
        if (isGoogleExpiredError(error)) {
          const newToken = await refreshGoogleToken({
            access_token: oauthGoogle.access_token,
            refresh_token: oauthGoogle.refresh_token,
            user_id: organizer_user_id,
          }, ctx)
          const newClient = googleApiClient(newToken.accessToken, newToken.refreshToken);
          response = await createGoogleEvent(newClient, {
            summary: title,
            description,
            attendees: all_participants_emails.map((email) => ({ email })),
            end: {
              dateTime: end_time,
              timeZone: timezone,
            },
            start: {
              dateTime: start_time,
              timeZone: timezone,
            },
          });
        } else {
          throw error;
        }
      }
      invariant(response, 'Failed to create Google event');

      const { conferenceData, hangoutLink, id: gEventId } = response.data;
      invariant(
        conferenceData && hangoutLink,
        new PublicError("Missing hangout link.")
      );

      const entryPoints = conferenceData.entryPoints;
      const phoneEntryPoint = find(entryPoints, { entryPointType: "phone" })!;
      const [countryCode, gPhone] = phoneEntryPoint.label!.split(" ");

      meeting_link = hangoutLink;
      phone_pin = phoneEntryPoint.pin as string;
      phone = gPhone as string;
      phone_country = countryCode;
      platform_event_id = gEventId as string;
      break;
    }
    case MeetingPlatform.MICROSOFT_TEAMS: {
      const oauthMicrosoft = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: organizer_user_id,
          provider: OauthProvider.MICROSOFT,
        },
      });

      invariant(oauthMicrosoft, "Not connected to Microsoft Team")

      const client = microsoftGraphClient(oauthMicrosoft.access_token);

      let response: MicrosoftGraph.Event | undefined = undefined;
      try {
        response = await createMicrosoftEvent(client, {
          subject: title,
          body: {
            content: description,
          },
          isOnlineMeeting: true,
          onlineMeetingProvider: "teamsForBusiness",
          attendees: all_participants_emails.map((email) => ({ emailAddress: { address: email }} )),
          allowNewTimeProposals: true,
          start: {
            dateTime: start_time,
            timeZone: timezone,
          },
          end: {
            dateTime: end_time,
            timeZone: timezone,
          },
        });
      } catch (error) {
        if (isMicrosoftExpiredError(error)) {
          const newToken = await refreshMicrosoftToken({
            access_token: oauthMicrosoft.access_token,
            refresh_token: oauthMicrosoft.refresh_token,
            user_id: organizer_user_id,
          }, ctx);
          const newClient = microsoftGraphClient(newToken.accessToken);
          response = await createMicrosoftEvent(newClient, {
            subject: title,
            body: {
              content: description,
            },
            isOnlineMeeting: true,
            onlineMeetingProvider: "teamsForBusiness",
            attendees: all_participants_emails.map((email) => ({ emailAddress: { address: email }} )),
            allowNewTimeProposals: true,
            start: {
              dateTime: start_time,
              timeZone: timezone,
            },
            end: {
              dateTime: end_time,
              timeZone: timezone,
            },
          });
        } else {
          throw error;
        }
      }
      invariant(response, 'Failed to create Microsoft Team event');

      const { id: mEventId, onlineMeeting, webLink } = response;
      invariant(
        (onlineMeeting && onlineMeeting.joinUrl) || webLink,
        new PublicError("Missing meeting link.")
      );

      meeting_link = onlineMeeting?.joinUrl || webLink as string;
      platform_event_id = mEventId as string;
      break;
    }
    default: {
      // Skip
      throw new InternalError(`Unsupported platform: ${platform}`)
    }
  }

  invariant(meeting_link, 'Failed to create meeting link.');

  return {
    meeting_link,
    phone_pin,
    phone,
    phone_country,
    platform_event_id,
  }
}

type CreateMeetingEventArgs = {
  title: string;
  meeting_link?: string | null;
  platform: string;
  end_time: string;
  start_time: string;
  cromatic_participants: Array<{ id: string; email: string; }>;
  external_participants: Array<{ email: string; name?: string | null; }>;
  timezone: string;
  description?: string | null;
  project_connection_id: string;
  organizer_user_id: string;
}

const createMeetingEvent = async (args: CreateMeetingEventArgs, ctx: ServiceContext) => {
  const {
    title,
    meeting_link: customMeetingLink,
    platform,
    end_time,
    start_time,
    timezone,
    cromatic_participants,
    external_participants,
    description,
    project_connection_id,
    organizer_user_id,
  } = args;

  let meeting_link = null;
  let phone_pin = null;
  let phone = null;
  let phone_country = null;
  let platform_event_id = null;


  const cromaticParticipantEmails = cromatic_participants.map((a) => a.email);
  const externalParticipantEmails = external_participants.map((a) => a.email);

  const organizerUser = await ctx.prisma.user.findFirst({
    where: {
      id: organizer_user_id,
    },
    include: {
      customer: {
        include: {
          biotech: true,
        }
      },
      vendor_member: {
        include: {
          vendor_company: true,
        },
      },
    },
  });
  const organizerIsBiotech = !!organizerUser?.customer;

  invariant(organizerUser, 'Organizer user not found.');

  // Create event on third party application
  if (platform === MeetingPlatform.CUSTOM) {
    invariant(customMeetingLink, "Missing custom meeting link.");
    meeting_link = customMeetingLink;
  } else {
    const newMeetingEventOnCalendarApp = await createMeetingEventOnCalendarApp(
      {
        all_participants_emails: [
          ...cromaticParticipantEmails,
          ...externalParticipantEmails,
          organizerUser.email,
        ],
        organizer_user_id: organizerUser.id,
        title,
        description: description || undefined,
        end_time,
        start_time,
        platform,
        timezone,
      },
      ctx
    );

    meeting_link = newMeetingEventOnCalendarApp.meeting_link;
    phone_pin = newMeetingEventOnCalendarApp.phone_pin;
    phone = newMeetingEventOnCalendarApp.phone;
    phone_country = newMeetingEventOnCalendarApp.phone_country;
    platform_event_id = newMeetingEventOnCalendarApp.platform_event_id;
  }

  const meetingAttendeeConnectionCreateData = [...cromatic_participants.map((p) => ({ user_id: p.id })), { user_id: organizer_user_id }];
  const newMeetingEvent = await ctx.prisma.meetingEvent.create({
    data: {
      title,
      description,
      end_time,
      start_time,
      platform,
      timezone,
      meeting_link,
      phone_pin,
      phone,
      phone_country,
      project_connection_id,
      platform_event_id,
      organizer_id: organizerUser.id,
      is_sharable: true,
      meetingAttendeeConnections: {
        create: meetingAttendeeConnectionCreateData,
      },
      meeting_guests: {
        create: external_participants.map((p) => ({
          email: p.email,
          type: MeetingGuestType.INVITE,
          status: MeetingGuestStatus.PENDING,
          name: p.name || null,
        })),
      },
    },
    include: {
      project_connection: {
        include: {
          project_request: true,
        },
      },
    },
  });

  const addExternalParticipantTasks = external_participants.map(async (p) => {
    return await addExternalGuestToMeeting(
      {
        email: p.email,
        name: p.name,
        meeting_event_id: newMeetingEvent.id,
      },
      ctx
    )
  })

  const meetingGuests = await Promise.all(addExternalParticipantTasks);

  const cromaticParticipantUserData = await ctx.prisma.user.findMany({
    where: {
      email: {
        in: cromaticParticipantEmails,
      },
    },
    include: {
      customer: true,
      vendor_member: true,
    },
  });

  if (platform === MeetingPlatform.CUSTOM) {
    const organizerParticipants = cromaticParticipantUserData.filter((u) => {
      const thisUserIsBiotech = !!u.customer;
      if (organizerIsBiotech && thisUserIsBiotech) {
        return true;
      } else if (!organizerIsBiotech && !thisUserIsBiotech) {
        return true;
      }
      return false;
    });
    const attendingParticipants = cromaticParticipantUserData.filter((u) => {
      const thisUserIsBiotech = !!u.customer;
      if (organizerIsBiotech && !thisUserIsBiotech) {
        return true;
      } else if (!organizerIsBiotech && thisUserIsBiotech) {
        return true;
      }
      return false;
    });
    const organizerParticipantEmailData = organizerParticipants.map((u) => ({
      meeting_title: newMeetingEvent.title,
      project_title: newMeetingEvent.project_connection.project_request.title,
      company_name: `${organizerUser.first_name} ${organizerUser.last_name}`,
      user_name: `${u.first_name} ${u.last_name}`,
      button_url: `${app_env.APP_URL}/app/meeting-events`,
      receive_email: u.email,
    }));
    const organizerCompany =
      organizerUser.customer?.biotech?.name ||
      organizerUser.vendor_member?.vendor_company?.name;
    const attendingParticipantEmailData = attendingParticipants.map((u) => ({
      meeting_title: newMeetingEvent.title,
      project_title: newMeetingEvent.project_connection.project_request.title,
      company_name: organizerCompany!,
      user_name: `${u.first_name} ${u.last_name}`,
      button_url: `${app_env.APP_URL}/app/meeting-events`,
      receive_email: u.email,
    }));

    [...organizerParticipantEmailData, ...attendingParticipantEmailData].map(
      ({ receive_email, ...data }) => {
        newMeetingNotificationEmail(data, receive_email);
      }
    );
  }

  const notificationJob = {
    data: cromaticParticipantUserData.map((u) =>
      createNewMeetingNotificationJob({
        meeting_event_id: newMeetingEvent.id,
        organizer_full_name: `${organizerUser.first_name} ${organizerUser.last_name}`,
        project_title:
          newMeetingEvent.project_connection.project_request.title,
        recipient_id: u.id,
      })
    ),
  };
  createNotificationQueueJob(notificationJob);

  return {
    ...newMeetingEvent,
    external_guests: meetingGuests,
  };
}

type RemoveMeetingEventOnCalendarAppArgs = {
  current_user_id: string;
  platform: string;
  platform_event_id: string;
}

// Only remove event on the calendar / video calling application.
const removeMeetingEventOnCalendarApp = async (
  args: RemoveMeetingEventOnCalendarAppArgs,
  ctx: ServiceContext
) => {
  const { current_user_id, platform, platform_event_id } = args;
  switch (platform) {
    case MeetingPlatform.GOOGLE_MEET: {
      const oauthGoogle = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: current_user_id,
          provider: OauthProvider.GOOGLE,
        },
      });
      invariant(oauthGoogle, new NoOAuthError());

      const client = googleApiClient(
        oauthGoogle.access_token,
        oauthGoogle.refresh_token
      );

      try {
        await deleteGoogleEvent(client, platform_event_id!);
      } catch (error) {
        if (isGoogleEventDeletedError(error)) {
          // Pass
          // If resource has been deleted, consider safe to proceed.
        } else if (isGoogleExpiredError(error)) {
          const newToken = await refreshGoogleToken(
            {
              access_token: oauthGoogle.access_token,
              refresh_token: oauthGoogle.refresh_token,
              user_id: current_user_id,
            },
            ctx,
          );
          const newClient = googleApiClient(newToken.accessToken, newToken.refreshToken);
          await deleteGoogleEvent(newClient, platform_event_id!);
        } else {
          throw error;
        }
      }
      break;
    }
    case MeetingPlatform.MICROSOFT_TEAMS: {
      const oauthMicrosoft = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: current_user_id,
          provider: OauthProvider.MICROSOFT,
        },
      });

      invariant(oauthMicrosoft, new NoOAuthError());

      try {
        const client = microsoftGraphClient(oauthMicrosoft.access_token);
        await deleteMicrosoftEvent(client, {
          id: platform_event_id,
        });
      } catch (error) {
        if (isMicrosoftExpiredError(error)) {
          const newToken = await refreshMicrosoftToken(
            {
              access_token: oauthMicrosoft.access_token,
              refresh_token: oauthMicrosoft.refresh_token,
              user_id: current_user_id,
            },
            ctx,
          );
          const newClient = microsoftGraphClient(newToken.accessToken);
          await deleteMicrosoftEvent(newClient, { id: platform_event_id });
        } else {
          throw error;
        }
      }

      break;
    }
    default:
  }
};

type RemoveMeetingEventArgs = {
  meeting_event_id: string;
  current_user_id: string;
}

const removeMeetingEvent = async (args: RemoveMeetingEventArgs, ctx: ServiceContext) => {
  const { meeting_event_id, current_user_id } = args;
  const meetingEvent = await ctx.prisma.meetingEvent.findFirst({
    where: {
      id: meeting_event_id,
    },
    include: {
      meetingAttendeeConnections: {
        include: {
          user: true,
        },
      },
      organizer: true,
      project_connection: {
        include: {
          project_request: true,
        },
      },
    },
  });

  invariant(meetingEvent, 'Meeting event not found.');

  // Delete all meeting attendee connections.
  await ctx.prisma.meetingAttendeeConnection.deleteMany({
    where: {
      meeting_event_id,
    },
  });
  // Delete meeting event record.
  const deletedMeetingEvent = await ctx.prisma.meetingEvent.delete({
    where: {
      id: meeting_event_id,
    },
  });

  if (meetingEvent.platform !== MeetingPlatform.CUSTOM) {
    invariant(deletedMeetingEvent.platform_event_id, 'Meeting event not found.');

    // Try-catch to prevent it from breaking the Cromatic platform functionality
    try {
      await removeMeetingEventOnCalendarApp(
        {
          current_user_id,
          platform: meetingEvent.platform,
          platform_event_id: meetingEvent.platform_event_id!
        },
        ctx,
      );
    } catch (error) {
      if (error instanceof NoOAuthError) {
        Sentry.captureMessage('No OAuth found.', 'log');
      } else {
        Sentry.captureException(error);
      }
    }
  }

  const notificationJob = {
    data: meetingEvent.meetingAttendeeConnections
      .filter((con) => con.user_id !== meetingEvent.organizer_id)
      .map((con) => createRemoveMeetingNotificationJob({
        meeting_event_id: meetingEvent.id,
        organizer_full_name: `${meetingEvent.organizer.first_name} ${meetingEvent.organizer.last_name}`,
        project_title: meetingEvent.project_connection.project_request.title,
        recipient_id: con.user_id,
      })),
  }
  createNotificationQueueJob(notificationJob);

  return deletedMeetingEvent;
}

type GetMicrosoftCalendarEventsArgs = {
  access_token: string;
  refresh_token: string;
  start_date_iso: string;
  end_date_iso?: string;
}

const getMicrosoftCalendarEvents = async (args: GetMicrosoftCalendarEventsArgs) => {
  const { access_token, start_date_iso, end_date_iso } = args;
  const client = microsoftGraphClient(access_token);

  // Doc: https://learn.microsoft.com/en-us/graph/filter-query-parameter?tabs=http
  const startDateFilterStr = `start/dateTime ge '${start_date_iso}'`;
  const endDateFilterStr = end_date_iso ? ` and start/dateTime le '${end_date_iso}'` : ''

  const response: { value: MicrosoftCalendarEvent[] } = await client
    .api("/me/calendar/events")
    .filter(`${startDateFilterStr}${endDateFilterStr}`)
    .get();

  return response.value.map((event) => ({
    id: event.id,
    title: event.subject,
    description: event.bodyPreview,
    start_time: moment.utc(event.start.dateTime).format(),
    end_time: moment.utc(event.end.dateTime).format(),
    timezone: event.start.timeZone,
    all_day: event.isAllDay,
    meeting_link: event.onlineMeeting?.joinUrl || event.webLink,
    guests: event.attendees.map(({ emailAddress }) => ({ name: emailAddress.name, email: emailAddress.address })),
    organizer: {
      name: event.organizer.emailAddress.name,
      email: event.organizer.emailAddress.address,
    },
    is_draft: event.isDraft,
  } as CalendarEvent)) || [];
}

type GetGoogleCalendarEventsArgs = {
  access_token: string;
  refresh_token: string;
  single_events: boolean;
  start_date_iso: string;
  end_date_iso?: string;
}

const getGoogleCalendarEvents = async (args: GetGoogleCalendarEventsArgs) => {
  const { access_token, refresh_token, single_events, start_date_iso, end_date_iso } = args;
  const client = googleApiClient(access_token, refresh_token);

  try {
    const response = await listGoogleEvents(client, single_events, start_date_iso, end_date_iso);
    return response?.map((event) => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      start_time: event.start?.dateTime,
      end_time: event.end?.dateTime,
      timezone: event.start?.timeZone,
      all_day: event.start?.date && !event.start.dateTime,
      meeting_link: event.hangoutLink || event.htmlLink,
      guests: event.attendees?.map(({ displayName, email }) => ({ name: displayName, email })),
      organizer: {
        name: event.organizer?.displayName,
        email: event.organizer?.email,
      },
      is_draft: false,
    } as CalendarEvent)) || [];
  } catch (error) {
    throw error;
  }
}

type GetCalendarEventsForUserArgs = {
  user_id: string;
  start_date_iso: string;
  end_date_iso?: string;
  calendar?: 'google' | 'microsoft' | 'all';
  googleConfig?: {
    single_events: boolean;
  };
}

const getCalendarEventsForUser = async (
  args: GetCalendarEventsForUserArgs,
  ctx: ServiceContext
): Promise<CalendarEvent[]> => {
  const { end_date_iso, start_date_iso, user_id, calendar = 'all', googleConfig = { single_events: true } } = args;
  let events: CalendarEvent[] = [];

  if (calendar === "all" || calendar === 'google') {
    const oauthGoogle = await ctx.prisma.oauth.findFirst({
      where: {
        user_id,
        provider: OauthProvider.GOOGLE,
      },
    });

    if (oauthGoogle) {
      try {
        const googleEvents = await getGoogleCalendarEvents({
          access_token: oauthGoogle.access_token,
          refresh_token: oauthGoogle.refresh_token,
          start_date_iso,
          end_date_iso,
          ...googleConfig,
        });
        events = events.concat(googleEvents);
      } catch (error) {
        if (isGoogleExpiredError(error)) {
          const newToken = await refreshGoogleToken({
            access_token: oauthGoogle.access_token,
            refresh_token: oauthGoogle.refresh_token,
            user_id,
          }, ctx);
          const googleEvents = await getGoogleCalendarEvents({
            access_token: newToken.accessToken,
            refresh_token: newToken.refreshToken,
            single_events: true,
            start_date_iso,
            end_date_iso,
          });
          events = events.concat(googleEvents);
        }
      }
    }
  }

  if (calendar === 'all' || calendar === 'microsoft') {
    const oauthMicrosoft = await ctx.prisma.oauth.findFirst({
      where: {
        user_id,
        provider: OauthProvider.MICROSOFT,
      },
    });

    if (oauthMicrosoft) {
      try {
        const microsoftEvents = await getMicrosoftCalendarEvents({
          access_token: oauthMicrosoft.access_token,
          refresh_token: oauthMicrosoft.refresh_token,
          start_date_iso,
          end_date_iso,
        });
        events = events.concat(microsoftEvents);
      } catch (error: any) {
        if (isMicrosoftExpiredError(error)) {
          const newToken = await refreshMicrosoftToken({
            access_token: oauthMicrosoft.access_token,
            refresh_token: oauthMicrosoft.refresh_token,
            user_id,
          }, ctx);
          const microsoftEvents = await getMicrosoftCalendarEvents({
            access_token: newToken.accessToken,
            refresh_token: newToken.refreshToken,
            start_date_iso,
            end_date_iso,
          });
          events = events.concat(microsoftEvents);
        }
      }
    }
  }

  return events;
}

type AddExternalGuestToMeetingArgs = {
  meeting_event_id: string;
  email: string;
  name?: string | null;
}

const addExternalGuestToMeeting = async (args: AddExternalGuestToMeetingArgs, ctx: ServiceContext) => {
  const { email, name, meeting_event_id } = args;

  const meeting = await ctx.prisma.meetingEvent.findFirst({
    where: {
      id: meeting_event_id,
    },
    include: {
      organizer: {
        include: {
          customer: {
            include: {
              biotech: true,
            },
          },
          vendor_member: {
            include: {
              vendor_company: true,
            },
          },
        },
      },
      project_connection: {
        include: {
          project_request: true,
        },
      },
    },
  });

  invariant(meeting, 'Meeting event not found.');

  const companyName =
    meeting.organizer.customer?.biotech?.name ||
    meeting.organizer.vendor_member?.vendor_company?.name;

  // Check if email is an existing Cromatic user
  const existingUser = await ctx.prisma.user.findFirst({
    where: {
      email,
    },
  });

  let isPartOfProject = false;
  // If yes, check if user part of project connection.
  if (existingUser) {
    isPartOfProject = await checkIfUserInProjectConnection(
      {
        project_connection_id: meeting.project_connection_id,
        user_id: existingUser.id,
      },
      ctx
    );
  }

  // Take name of existing user from our DB
  const guestName = existingUser
    ? `${existingUser.first_name} ${existingUser.last_name}`
    : name;

  const guest = await ctx.prisma.meetingGuest.upsert({
    where: {
      email_meeting_event_id: {
        email,
        meeting_event_id,
      },
    },
    create: {
      email: email,
      name: guestName || null,
      type: "invite",
      status: "pending",
      meeting_event_id,
    },
    update: {},
  });

  if (isPartOfProject) {
    meetingInvitationForCromaticUserWithinProjectEmail(
      {
        button_url: `${app_env.APP_URL}/app/meeting-events`,
        company_name: companyName!,
        guest_name: name || "guest",
        meeting_title: meeting.title,
        project_title: meeting.project_connection.project_request.title,
      },
      email,
    );
  } else {
    meetingInvitationForGuestEmail(
      {
        button_url: `${app_env.APP_URL}/meeting/${meeting.id}?authToken=${guest.id}`,
        company_name: companyName!,
        guest_name: name || "guest",
        meeting_title: meeting.title,
        project_title: meeting.project_connection.project_request.title,
      },
      email,
    );
  }

  return guest;
}

type UpdateMeetingEventArgs = {
  meeting_event_id: string;
  organizer_user_id: string;

  start_time?: string;
  end_time?: string;
  timezone?: string;
  title?: string;
  description?: string;
}

const updateMeetingEvent = async (
  args: UpdateMeetingEventArgs,
  ctx: ServiceContext
) => {
  const {
    meeting_event_id,
    end_time,
    start_time,
    description,
    title,
    organizer_user_id,
    timezone,
  } = args;
  const meetingEvent = await ctx.prisma.meetingEvent.findFirst({
    where: {
      id: meeting_event_id,
    },
    include: {
      meetingAttendeeConnections: {
        include: {
          user: true,
        },
      },
    },
  });

  invariant(meetingEvent, "Meeting event not found.");

  // Skip if no new changes.
  if (
    (title ? title === meetingEvent.title : true) &&
    (description ? description === meetingEvent.description : true) &&
    (end_time ? end_time === meetingEvent.end_time.toISOString() : true) &&
    (start_time ? start_time === meetingEvent.start_time.toISOString() : true) &&
    (timezone ? timezone === meetingEvent.timezone : true)
  ) {
    return meetingEvent;
  }

  const organizerUser = await ctx.prisma.user.findFirst({
    where: {
      id: organizer_user_id,
    },
    include: {
      customer: {
        include: {
          biotech: true,
        },
      },
      vendor_member: {
        include: {
          vendor_company: true,
        },
      },
    },
  });

  invariant(organizerUser, 'Missing organizer user.')

  const updatedMeetingEvent = await ctx.prisma.meetingEvent.update({
    where: {
      id: meeting_event_id,
    },
    data: {
      start_time,
      end_time,
      timezone,
      title,
      description,
    },
    include: {
      organizer: true,
      project_connection: {
        include: {
          project_request: true,
        },
      },
      meetingAttendeeConnections: {
        include: {
          user: {
            include: {
              customer: true,
              vendor_member: true,
            },
          },
        },
      },
      meeting_guests: {
        where: {
          status: MeetingGuestStatus.ACCEPTED,
        },
      },
    },
  });

  // Update meeting info on calendar event.
  if (meetingEvent.platform !== MeetingPlatform.CUSTOM) {
    invariant(meetingEvent.platform_event_id, "Platform event id not found.");
  }
  switch (meetingEvent.platform) {
    case MeetingPlatform.GOOGLE_MEET: {
      const oauthGoogle = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: organizer_user_id,
          provider: OauthProvider.GOOGLE,
        },
      });
      invariant(oauthGoogle, new PublicError("Missing token."));

      const patchEventData: GEvent = {
        ...(title ? { summary: title } : {}),
        ...(description ? { description } : {}),
      };
      if (start_time) {
        invariant(timezone, "Missing timezone");
        patchEventData.start = {
          dateTime: start_time,
          timeZone: timezone,
        };
      }
      if (end_time) {
        invariant(timezone, "Missing timezone");
        patchEventData.end = {
          dateTime: end_time,
          timeZone: timezone,
        };
      }

      await safePatchGoogleEvent(
        {
          access_token: oauthGoogle.access_token,
          refresh_token: oauthGoogle.refresh_token,
          platform_event_id: meetingEvent.platform_event_id!,
          g_event: patchEventData,
          organizer_user_id,
          send_updates: true,
        },
        ctx,
      )
      break;
    }
    case MeetingPlatform.MICROSOFT_TEAMS: {
      const oauthMicrosoft = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: organizer_user_id,
          provider: OauthProvider.MICROSOFT,
        },
      });

      invariant(oauthMicrosoft, new PublicError("Missing token."));

      const patchEventData: MicrosoftGraph.Event = {
        ...(title ? { subject: title } : {}),
        ...(description ? { description } : {}),
        id: meetingEvent.platform_event_id!,
      };
      if (start_time) {
        invariant(timezone, "Missing timezone");
        patchEventData.start = {
          dateTime: start_time,
          timeZone: timezone,
        };
      }
      if (end_time) {
        invariant(timezone, "Missing timezone");
        patchEventData.end = {
          dateTime: end_time,
          timeZone: timezone,
        };
      }

      await safePatchMicrosoftEvent(
        {
          access_token: oauthMicrosoft.access_token,
          refresh_token: oauthMicrosoft.refresh_token,
          event_data: patchEventData,
          organizer_user_id,
        },
        ctx,
      )
      break;
    }
    case MeetingPlatform.CUSTOM:
    default:
  }

  const cromaticParticipantUserData = updatedMeetingEvent
    .meetingAttendeeConnections
    .filter((mac) => mac.user.email !== organizerUser.email)
    .map((mac) => mac.user);
  const organizerIsBiotech = !!organizerUser?.customer;
    const organizerCompanyName =
      organizerUser.customer?.biotech?.name ||
      organizerUser.vendor_member?.vendor_company?.name;
    const organizerParticipants = cromaticParticipantUserData.filter((u) => {
      const thisUserIsBiotech = !!u.customer;
      if (organizerIsBiotech && thisUserIsBiotech) {
        return true;
      } else if (!organizerIsBiotech && !thisUserIsBiotech) {
        return true;
      }
      return false;
    });
    const attendingParticipants = cromaticParticipantUserData.filter((u) => {
      const thisUserIsBiotech = !!u.customer;
      if (organizerIsBiotech && !thisUserIsBiotech) {
        return true;
      } else if (!organizerIsBiotech && thisUserIsBiotech) {
        return true;
      }
      return false;
    });
  if (meetingEvent.platform === MeetingPlatform.CUSTOM) {
    // Generate email data for all participants
    const organizerParticipantEmailData = organizerParticipants.map((u) => ({
      meeting_title: updatedMeetingEvent.title,
      project_title:
        updatedMeetingEvent.project_connection.project_request.title,
      company_name: `${organizerUser.first_name} ${organizerUser.last_name}`,
      user_name: `${u.first_name} ${u.last_name}`,
      button_url: `${app_env.APP_URL}/app/meeting-events`,
      receive_email: u.email,
    }));
    const attendingParticipantEmailData = attendingParticipants.map((u) => ({
      meeting_title: updatedMeetingEvent.title,
      project_title:
        updatedMeetingEvent.project_connection.project_request.title,
      company_name: organizerCompanyName!,
      user_name: `${u.first_name} ${u.last_name}`,
      button_url: `${app_env.APP_URL}/app/meeting-events`,
      receive_email: u.email,
    }));
    const externalParticipantEmailData = updatedMeetingEvent.meeting_guests.map((guest) => ({
      meeting_title: updatedMeetingEvent.title,
      project_title:
        updatedMeetingEvent.project_connection.project_request.title,
      company_name: organizerCompanyName!,
      user_name: guest.name ? guest.name : 'guest',
      button_url: `${app_env.APP_URL}/meeting/${updatedMeetingEvent.id}?authToken=${guest.id}`,
      receive_email: guest.email,
    }));
    // Send email to all participants.
    [
      ...organizerParticipantEmailData,
      ...attendingParticipantEmailData,
      ...externalParticipantEmailData,
    ].map(
      ({ receive_email, ...emailData }) => {
        updatedMeetingNotificationEmail(emailData, receive_email);
      }
    );
  }

  // Generate in-app notification data.
  const organizerParticipantNotifcationJob = organizerParticipants.map((u) =>
    createUpdateMeetingNotificationJob({
      project_title:
        updatedMeetingEvent.project_connection.project_request.title,
      organizer_full_name: `${organizerUser.first_name} ${organizerUser.last_name}`,
      meeting_event_id: updatedMeetingEvent.id,
      recipient_id: u.id,
    })
  );
  const attendingParticipantNotifcationJob = attendingParticipants.map((u) =>
    createUpdateMeetingNotificationJob({
      project_title:
        updatedMeetingEvent.project_connection.project_request.title,
      organizer_full_name: organizerCompanyName!,
      meeting_event_id: updatedMeetingEvent.id,
      recipient_id: u.id,
    })
  );
  createNotificationQueueJob({
    data: [
      ...organizerParticipantNotifcationJob,
      ...attendingParticipantNotifcationJob,
    ],
  });

  return updatedMeetingEvent;
};

type UpdateMeetingPlatformArgs = {
  meeting_event_id: string;
  organizer_user_id: string;
  platform: string;
  meeting_link?: string;
}

const updateMeetingPlatform = async (
  args: UpdateMeetingPlatformArgs,
  ctx: ServiceContext
) => {
  const {
    meeting_event_id,
    platform: newPlatform,
    meeting_link: newMeetingLink,
    organizer_user_id,
  } = args;

  const organizerUser = await ctx.prisma.user.findFirst({
    where: {
      id: organizer_user_id,
    },
    include: {
      customer: {
        include: {
          biotech: true,
        },
      },
      vendor_member: {
        include: {
          vendor_company: true,
        },
      },
    },
  });

  invariant(organizerUser, "Missing current user.");

  const previousMeetingEvent = await ctx.prisma.meetingEvent.findFirst({
    where: {
      id: meeting_event_id,
    },
    include: {
      meetingAttendeeConnections: {
        include: {
          user: true,
        },
      },
      meeting_guests: {
        where: {
          status: MeetingGuestStatus.ACCEPTED,
        },
      },
    },
  });

  invariant(previousMeetingEvent, "Meeting event not found.");

  if (
    (previousMeetingEvent.platform === MeetingPlatform.CUSTOM &&
      newPlatform === MeetingPlatform.CUSTOM &&
      previousMeetingEvent.meeting_link === newMeetingLink) ||
    previousMeetingEvent.platform === newPlatform
  ) {
    return previousMeetingEvent;
  }


  const existingCromaticParticipantsEmails =
    previousMeetingEvent.meetingAttendeeConnections.map((u) => u.user.email);
  const existingCromaticParticipantWithoutOrganizerEmails =
    existingCromaticParticipantsEmails.filter((e) => e !== organizerUser.email);

  const existingExternalParticipantsEmails =
    previousMeetingEvent.meeting_guests.map((g) => g.email);

  const cromaticParticipantWithoutOrganizerUserData =
    await ctx.prisma.user.findMany({
      where: {
        email: {
          in: existingCromaticParticipantWithoutOrganizerEmails,
        },
      },
      include: {
        customer: true,
        vendor_member: true,
      },
    });

  let updatedMeetingEvent: MeetingEvent & {
    project_connection: ProjectConnection & {
      project_request: ProjectRequest;
    };
  };

  const organizerCompanyName =
    organizerUser.customer?.biotech?.name ||
    organizerUser.vendor_member?.vendor_company?.name;
  const organizerIsBiotech = !!organizerUser?.customer;
  const organizerParticipants =
    cromaticParticipantWithoutOrganizerUserData.filter((u) => {
      const thisUserIsBiotech = !!u.customer;
      if (organizerIsBiotech && thisUserIsBiotech) {
        return true;
      } else if (!organizerIsBiotech && !thisUserIsBiotech) {
        return true;
      }
      return false;
    });
  const attendingParticipants =
    cromaticParticipantWithoutOrganizerUserData.filter((u) => {
      const thisUserIsBiotech = !!u.customer;
      if (organizerIsBiotech && !thisUserIsBiotech) {
        return true;
      } else if (!organizerIsBiotech && thisUserIsBiotech) {
        return true;
      }
      return false;
    });

  if (newPlatform === MeetingPlatform.CUSTOM) {
    invariant(newMeetingLink, "Missing new meeting link");

    updatedMeetingEvent = await ctx.prisma.meetingEvent.update({
      where: {
        id: previousMeetingEvent.id,
      },
      data: {
        meeting_link: newMeetingLink,
        platform: newPlatform,
        phone: null,
        phone_pin: null,
        phone_country: null,
        platform_event_id: null,
      },
      include: {
        project_connection: {
          include: {
            project_request: true,
          },
        },
      },
    });

    // Generate email data for all participants
    const organizerParticipantEmailData = organizerParticipants.map((u) => ({
      meeting_title: updatedMeetingEvent.title,
      project_title:
        updatedMeetingEvent.project_connection.project_request.title,
      company_name: `${organizerUser.first_name} ${organizerUser.last_name}`,
      user_name: `${u.first_name} ${u.last_name}`,
      button_url: `${app_env.APP_URL}/app/meeting-events`,
      receive_email: u.email,
    }));
    const attendingParticipantEmailData = attendingParticipants.map((u) => ({
      meeting_title: updatedMeetingEvent.title,
      project_title:
        updatedMeetingEvent.project_connection.project_request.title,
      company_name: organizerCompanyName!,
      user_name: `${u.first_name} ${u.last_name}`,
      button_url: `${app_env.APP_URL}/app/meeting-events`,
      receive_email: u.email,
    }));
    const externalParticipantEmailData = previousMeetingEvent.meeting_guests.map((guest) => ({
      meeting_title: updatedMeetingEvent.title,
      project_title:
        updatedMeetingEvent.project_connection.project_request.title,
      company_name: organizerCompanyName!,
      user_name: guest.name ? guest.name : 'guest',
      button_url: `${app_env.APP_URL}/meeting/${updatedMeetingEvent.id}?authToken=${guest.id}`,
      receive_email: guest.email,
    }));

    // Send email to all participants.
    [
      ...organizerParticipantEmailData,
      ...attendingParticipantEmailData,
      ...externalParticipantEmailData,
    ].map(
      ({ receive_email, ...emailData }) => {
        updatedMeetingNotificationEmail(emailData, receive_email);
      }
    );
  } else {
    const newMeetingEventOnCalendarApp = await createMeetingEventOnCalendarApp(
      {
        end_time: previousMeetingEvent.end_time.toISOString(),
        start_time: previousMeetingEvent.start_time.toISOString(),
        platform: newPlatform,
        timezone: previousMeetingEvent.timezone,
        title: previousMeetingEvent.title,
        description: previousMeetingEvent.description || undefined,
        organizer_user_id: organizer_user_id,
        all_participants_emails: [
          ...existingCromaticParticipantsEmails,
          ...existingExternalParticipantsEmails,
        ],
      },
      ctx
    );

    updatedMeetingEvent = await ctx.prisma.meetingEvent.update({
      where: {
        id: previousMeetingEvent.id,
      },
      data: {
        meeting_link: newMeetingEventOnCalendarApp.meeting_link,
        platform: newPlatform,
        phone: newMeetingEventOnCalendarApp.phone,
        phone_pin: newMeetingEventOnCalendarApp.phone_pin,
        phone_country: newMeetingEventOnCalendarApp.phone_country,
        platform_event_id: newMeetingEventOnCalendarApp.platform_event_id,
      },
      include: {
        project_connection: {
          include: {
            project_request: true,
          },
        },
      },
    });
  }

  // Generate in-app notification data.
  const organizerParticipantNotifcationJob = organizerParticipants.map((u) =>
    createUpdateMeetingNotificationJob({
      project_title:
        updatedMeetingEvent.project_connection.project_request.title,
      organizer_full_name: `${organizerUser.first_name} ${organizerUser.last_name}`,
      meeting_event_id: updatedMeetingEvent.id,
      recipient_id: u.id,
    })
  );
  const attendingParticipantNotifcationJob = attendingParticipants.map((u) =>
    createUpdateMeetingNotificationJob({
      project_title:
        updatedMeetingEvent.project_connection.project_request.title,
      organizer_full_name: organizerCompanyName!,
      meeting_event_id: updatedMeetingEvent.id,
      recipient_id: u.id,
    })
  );
  createNotificationQueueJob({
    data: [
      ...organizerParticipantNotifcationJob,
      ...attendingParticipantNotifcationJob,
    ],
  });

  // Prevent remove meeting failure from causing
  try {
    await removeMeetingEventOnCalendarApp(
      {
        current_user_id: organizer_user_id,
        platform: previousMeetingEvent.platform,
        platform_event_id: previousMeetingEvent.platform_event_id!,
      },
      ctx
    );
  } catch (error) {
    // no-op
  }

  return updatedMeetingEvent;
};

type RemoveCromaticParticipantArgs = {
  meeting_event_id: string;
  user_id: string;
  organizer_user_id: string;
}

const removeCromaticParticipant = async (args: RemoveCromaticParticipantArgs, ctx: ServiceContext) => {
  const { meeting_event_id, user_id, organizer_user_id } = args;

  const meetingEvent = await ctx.prisma.meetingEvent.findFirst({
    where: {
      id: meeting_event_id,
    },
    include: {
      meeting_guests: true,
    },
  });

  invariant(meetingEvent, "Meeting event not found.");

  await ctx.prisma.meetingAttendeeConnection.deleteMany({
    where: {
      meeting_event_id,
      user: {
        id: user_id,
      },
    },
  });

  const existingAttendeeConnections =
    await ctx.prisma.meetingAttendeeConnection.findMany({
      where: {
        meeting_event_id,
      },
      include: {
        user: true,
      },
    });

  const existingAttendees = existingAttendeeConnections.map(
    (conn) => conn.user
  );

  const existingExternalGuests = meetingEvent.meeting_guests;

  switch (meetingEvent.platform) {
    case MeetingPlatform.GOOGLE_MEET: {
      const oauthGoogle = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: organizer_user_id,
          provider: OauthProvider.GOOGLE,
        },
      });
      invariant(oauthGoogle, new PublicError("Missing token."));
      const attendeesArr = [
        ...existingAttendees.map((a) => ({ email: a.email })),
        ...existingExternalGuests.map((a) => ({ email: a.email })),
      ];

      await safePatchGoogleEvent(
        {
          access_token: oauthGoogle.access_token,
          refresh_token: oauthGoogle.refresh_token,
          g_event: { attendees: attendeesArr },
          organizer_user_id: organizer_user_id,
          platform_event_id: meetingEvent.platform_event_id!,
          send_updates: true,
        },
        ctx
      );
      break;
    }
    case MeetingPlatform.MICROSOFT_TEAMS: {
      const oauthMicrosoft = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: organizer_user_id,
          provider: OauthProvider.MICROSOFT,
        },
      });

      invariant(oauthMicrosoft, new PublicError("Missing token."));
      const client = microsoftGraphClient(oauthMicrosoft.access_token);
      const attendeesArr = [
        ...existingAttendees.map((a) => ({
          emailAddress: { address: a.email },
        })),
        ...existingExternalGuests.map((a) => ({
          emailAddress: { address: a.email },
        })),
      ];
      await safePatchMicrosoftEvent(
        {
          access_token: oauthMicrosoft.access_token,
          refresh_token: oauthMicrosoft.refresh_token,
          event_data: {
            attendees: attendeesArr,
            id: meetingEvent.platform_event_id!,
          },
          organizer_user_id,
        },
        ctx
      );
      break;
    }
    default:
  }
}

type AddParticipantsArgs = {
  cromatic_participants: { email: string; id: string; }[];
  external_participants: { email: string; name?: string | null; }[]
  meeting_event_id: string;
  organizer_user_id: string;
}

const addParticipants = async (args: AddParticipantsArgs, ctx: ServiceContext) => {
  const { cromatic_participants, external_participants, meeting_event_id, organizer_user_id } = args;

  const organizerUser = await ctx.prisma.user.findFirst({
    where: {
      id: organizer_user_id,
    },
    include: {
      customer: {
        include: {
          biotech: true,
        }
      },
      vendor_member: {
        include: {
          vendor_company: true,
        },
      },
    },
  });
  invariant(organizerUser, 'Organizer user not found.');

  const meetingEvent = await ctx.prisma.meetingEvent.findFirst({
    where: {
      id: meeting_event_id,
    },
    include: {
      meetingAttendeeConnections: {
        include: {
          user: true,
        },
      },
      meeting_guests: true,
      project_connection: {
        include: {
          project_request: true,
        },
      },
    },
  });

  invariant(meetingEvent, "Meeting event not found");

  invariant(meetingEvent.organizer_id === organizer_user_id, "User is not organizer");

  const addExternalParticipantTasks = external_participants.map(
    async (p) => {
      const { email, name } = p;
      return await addExternalGuestToMeeting(
        {
          email,
          name,
          meeting_event_id,
        },
        ctx,
      );
    }
  );

  await Promise.all(addExternalParticipantTasks);

  const addCromaticParticipantTasks = cromatic_participants.map(
    async (p) => {
      const userId = p.id!;

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      await ctx.prisma.meetingAttendeeConnection.create({
        data: {
          user_id: userId,
          meeting_event_id,
        },
      });

      return user;
    }
  );

  const cromaticUsers = await Promise.all(addCromaticParticipantTasks);

  // Update attendees on calendar / video call app
  const existingAttendees = meetingEvent.meetingAttendeeConnections.map(
    (mac) => mac.user
  );
  const existingExternalGuests = meetingEvent.meeting_guests;

  switch (meetingEvent.platform) {
    case MeetingPlatform.GOOGLE_MEET: {
      const oauthGoogle = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: organizer_user_id,
          provider: OauthProvider.GOOGLE,
        },
      });
      invariant(oauthGoogle, new PublicError("Missing token."));

      const attendeesArr = [
        ...existingAttendees.map((a) => ({ email: a.email })),
        ...existingExternalGuests.map((a) => ({ email: a.email })),
        ...cromatic_participants.map((a) => ({ email: a.email })),
      ];

      await safePatchGoogleEvent(
        {
          access_token: oauthGoogle.access_token,
          refresh_token: oauthGoogle.refresh_token,
          g_event: { attendees: attendeesArr },
          organizer_user_id: organizer_user_id,
          platform_event_id: meetingEvent.platform_event_id!,
          send_updates: true,
        },
        ctx,
      );
      break;
    }
    case MeetingPlatform.MICROSOFT_TEAMS: {
      const oauthMicrosoft = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: organizer_user_id,
          provider: OauthProvider.MICROSOFT,
        },
      });

      invariant(oauthMicrosoft, new PublicError("Missing token."));
      const attendeesArr = [
        ...existingAttendees.map((a) => ({
          emailAddress: { address: a.email },
        })),
        ...existingExternalGuests.map((a) => ({
          emailAddress: { address: a.email },
        })),
        ...cromatic_participants.map((a) => ({
          emailAddress: { address: a.email },
        })),
      ];
      await safePatchMicrosoftEvent(
        {
          access_token: oauthMicrosoft.access_token,
          refresh_token: oauthMicrosoft.refresh_token,
          organizer_user_id,
          event_data: {
            attendees: attendeesArr,
            id: meetingEvent.platform_event_id!,
          },
        },
        ctx
      );
      break;
    }
    default:
  }

  const cromaticParticipantEmails = cromatic_participants.map((a) => a.email);
  const cromaticParticipantUserData = await ctx.prisma.user.findMany({
    where: {
      email: {
        in: cromaticParticipantEmails,
      },
    },
    include: {
      customer: true,
      vendor_member: true,
    },
  });
  if (meetingEvent.platform === MeetingPlatform.CUSTOM) {
    const organizerIsBiotech = !!organizerUser?.customer;
    const organizerParticipants = cromaticParticipantUserData.filter((u) => {
      const thisUserIsBiotech = !!u.customer;
      if (organizerIsBiotech && thisUserIsBiotech) {
        return true;
      } else if (!organizerIsBiotech && !thisUserIsBiotech) {
        return true;
      }
      return false;
    });
    const attendingParticipants = cromaticParticipantUserData.filter((u) => {
      const thisUserIsBiotech = !!u.customer;
      if (organizerIsBiotech && !thisUserIsBiotech) {
        return true;
      } else if (!organizerIsBiotech && thisUserIsBiotech) {
        return true;
      }
      return false;
    });
    const organizerParticipantEmailData = organizerParticipants.map((u) => ({
      meeting_title: meetingEvent.title,
      project_title: meetingEvent.project_connection.project_request.title,
      company_name: `${organizerUser.first_name} ${organizerUser.last_name}`,
      user_name: `${u.first_name} ${u.last_name}`,
      button_url: `${app_env.APP_URL}/app/meeting-events`,
      receive_email: u.email,
    }));
    const organizerCompany =
      organizerUser.customer?.biotech?.name ||
      organizerUser.vendor_member?.vendor_company?.name;
    const attendingParticipantEmailData = attendingParticipants.map((u) => ({
      meeting_title: meetingEvent.title,
      project_title: meetingEvent.project_connection.project_request.title,
      company_name: organizerCompany!,
      user_name: `${u.first_name} ${u.last_name}`,
      button_url: `${app_env.APP_URL}/app/meeting-events`,
      receive_email: u.email,
    }));

    const notificationJob = {
      data: cromaticParticipantUserData.map((u) =>
        createNewMeetingNotificationJob({
          meeting_event_id: meetingEvent.id,
          organizer_full_name: `${organizerUser.first_name} ${organizerUser.last_name}`,
          project_title: meetingEvent.project_connection.project_request.title,
          recipient_id: u.id,
        })
      ),
    };
    createNotificationQueueJob(notificationJob);

    [...organizerParticipantEmailData, ...attendingParticipantEmailData].map(
      ({ receive_email, ...data }) => {
        newMeetingNotificationEmail(data, receive_email);
      }
    );
  }

  return [
    ...cromaticUsers.map((p) => ({
      email: p!.email,
      name: `${p!.first_name} ${p!.last_name}`,
      status: MeetingGuestStatus.ACCEPTED,
    })),
    ...external_participants.map((p) => ({
      email: p.email,
      name: p.name,
      status: MeetingGuestStatus.PENDING,
    })),
  ];
}

const meetingEventService = {
  createMeetingEvent,
  removeMeetingEvent,
  updateMeetingEvent,
  updateMeetingPlatform,
  addExternalGuestToMeeting,
  getCalendarEventsForUser,
  removeCromaticParticipant,
  addParticipants,
  safePatchGoogleEvent,
  safePatchMicrosoftEvent,
};

export default meetingEventService;
