import moment from "moment";
import { User } from "@prisma/client";
import invariant from "../../helper/invariant";
import { createMicrosoftEvent, deleteMicrosoftEvent, microsoftClientRefreshToken, microsoftGraphClient, patchMicrosoftEvent } from "../../helper/microsoft";
import { createGoogleEvent, deleteGoogleEvent, googleApiClient, listGoogleEvents, patchGoogleEvent } from "../../helper/googleCalendar";
import { findCommonFreeSlotsForAllUser, findFreeSlots, processCalendarEvents } from "../../helper/timeSlot";
import { MeetingGuestStatus, MeetingGuestType, MeetingPlatform, OauthProvider } from "../../helper/constant";
import { createNewMeetingNotificationJob, createRemoveMeetingNotificationJob, createUpdateMeetingNotificationJob } from "../../notification/meetingNotification";
import { createNotificationQueueJob } from "../../queues/notification.queues";
import { find, intersectionBy } from "lodash";
import { ServiceContext } from "../../types/context";
import { MicrosoftCalendarEvent } from "../../types/microsoft";
import { CalendarEvent } from "../../graphql/generated";
import { PublicError } from "../../graphql/errors/PublicError";
import { checkIfUserInProjectConnection } from "../projectConnection/projectConnection.service";
import { meetingInvitationForCromaticUserWithinProjectEmail, meetingInvitationForGuestEmail } from "../../mailer/guestMeeting";
import { app_env } from "../../environment";

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
  organizer_user: User;
}

const createMeetingAttendeeConnections = async (attendeeEmails: string[], organizer_user: User, ctx: ServiceContext) => {
  const attendeeUsers = await ctx.prisma.user.findMany({
    where: { email: { in: attendeeEmails } },
  });

  return [...attendeeUsers, organizer_user].map(u => ({ user_id: u.id }));
};

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
    organizer_user,
  } = args;

  let meeting_link = '';
  let phone_pin = '';
  let phone = '';
  let phone_country = '';
  let platform_event_id = '';


  const cromaticParticipantEmails = cromatic_participants.map((a) => a.email);

  const attendeeConnections = await createMeetingAttendeeConnections(cromaticParticipantEmails, organizer_user, ctx);

  // Create event on third party application
  switch (platform) {
    case MeetingPlatform.GOOGLE_MEET: {
      const oauthGoogle = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: organizer_user.id,
          provider: OauthProvider.GOOGLE,
        },
      });

      if (oauthGoogle) {
        const client = googleApiClient(oauthGoogle.access_token, oauthGoogle.refresh_token);
        const attendeeArr = [
          ...cromatic_participants.map((a) => ({ email: a.email })),
          ...external_participants.map((a) => ({ email: a.email })),
          { email: organizer_user.email },
        ];

        const response = await createGoogleEvent(client, {
          summary: title,
          description,
          attendees: attendeeArr,
          end: {
            dateTime: end_time,
            timeZone: timezone,
          },
          start: {
            dateTime: start_time,
            timeZone: timezone,
          },
        });
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
      }
      break;
    }
    case MeetingPlatform.MICROSOFT_TEAMS: {
      const oauthMicrosoft = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: organizer_user.id,
          provider: OauthProvider.MICROSOFT,
        },
      });

      if (oauthMicrosoft) {
        const client = microsoftGraphClient(oauthMicrosoft.access_token);
        const response = await createMicrosoftEvent(client, {
          subject: title,
          body: {
            content: description,
          },
          isOnlineMeeting: true,
          onlineMeetingProvider: "teamsForBusiness",
          attendees: [
            ...cromatic_participants.map((a) => ({ emailAddress: { address: a.email }} )),
            ...external_participants.map((a) => ({ emailAddress: { address: a.email }} )),
            { emailAddress: { address: organizer_user.email! } },
          ],
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

        const { id: mEventId, onlineMeeting, webLink } = response;
        invariant(
          (onlineMeeting && onlineMeeting.joinUrl) || webLink,
          new PublicError("Missing meeting link.")
        );

        meeting_link = onlineMeeting?.joinUrl || webLink as string;
        platform_event_id = mEventId as string;
        break;
      } else {
        throw new PublicError("User not connected to Microsoft Teams");
      }
    }
    case MeetingPlatform.CUSTOM:
    default: {
      invariant(customMeetingLink, new PublicError("Missing meeting link."));
      meeting_link = customMeetingLink;
      break;
    }
  }

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
      organizer_id: organizer_user.id,
      is_sharable: true,
      meetingAttendeeConnections: {
        create: attendeeConnections,
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

  const notificationJob = {
    data: attendeeConnections.map((a) =>
      createNewMeetingNotificationJob({
        meeting_event_id: newMeetingEvent.id,
        organizer_full_name: `${organizer_user.first_name} ${organizer_user.last_name}`,
        project_title:
          newMeetingEvent.project_connection.project_request.title,
        recipient_id: a.user_id,
      })
    ),
  };
  createNotificationQueueJob(notificationJob);

  return {
    ...newMeetingEvent,
    external_guests: meetingGuests,
  };
}

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

  invariant(deletedMeetingEvent.platform_event_id, 'Meeting event not found.');


  switch (meetingEvent.platform) {
    case MeetingPlatform.GOOGLE_MEET: {
      const oauthGoogle = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: current_user_id,
          provider: OauthProvider.GOOGLE,
        },
      });
      invariant(oauthGoogle, new PublicError("Missing token."));

      const client = googleApiClient(
        oauthGoogle.access_token,
        oauthGoogle.refresh_token
      );

      await deleteGoogleEvent(client, meetingEvent.platform_event_id!);
      break;
    }
    case MeetingPlatform.MICROSOFT_TEAMS: {
      const oauthMicrosoft = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: current_user_id,
          provider: OauthProvider.MICROSOFT,
        },
      });

      invariant(oauthMicrosoft, new PublicError("Missing token."));
      const client = microsoftGraphClient(oauthMicrosoft.access_token);
      await deleteMicrosoftEvent(client, {
        id: meetingEvent.platform_event_id!,
      });
      break;
    }
    default:
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

type UpdateMeetingEventArgs = {
  meeting_event_id: string;
  attendee_emails: string[];
  end_time: string;
  start_time: string;
  timezone: string;
  title: string;
  description?: string | null;
}

const updateMeetingEvent = async (args: UpdateMeetingEventArgs, ctx: ServiceContext) => {
  const { attendee_emails, end_time, meeting_event_id, start_time, timezone, title, description } = args;
  const oldMeetingEvent = await ctx.prisma.meetingEvent.findFirst({
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

  invariant(oldMeetingEvent, 'Meeting event not found.');

  // Find all attendees. This INCLUDE the organizer.
  const attendeeUsers = await ctx.prisma.user.findMany({
    where: {
      email: {
        in: attendee_emails,
      },
    },
  });

  // Remove all and recreate meeting attendee connections.
  const data = [...attendeeUsers].map((u) => ({
    user_id: u.id,
    meeting_event_id: meeting_event_id,
  }));
  await ctx.prisma.meetingAttendeeConnection.deleteMany({
    where: {
      meeting_event_id,
    },
  });
  await ctx.prisma.meetingAttendeeConnection.createMany({
    data,
  });

  let meeting_link: string | undefined = undefined;
  let phone_pin: string | undefined = undefined;
  let phone: string | undefined = undefined;
  let phone_country: string | undefined = undefined;
  let platform_event_id: string | undefined = undefined;

  switch (oldMeetingEvent.platform) {
    case MeetingPlatform.GOOGLE_MEET: {
      const oauthGoogle = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: oldMeetingEvent.organizer_id,
          provider: OauthProvider.GOOGLE,
        },
      });
      if (oauthGoogle) {
        const client = googleApiClient(oauthGoogle.access_token, oauthGoogle.refresh_token);
          // Patch Google event
        const existingAttendees = oldMeetingEvent.meetingAttendeeConnections.map((mac) => mac.user);
        const attendeeArr = [...attendee_emails.map((a) => ({ email: a }))];
        const existingAttendeesThatRemain = intersectionBy(existingAttendees, attendeeArr, 'email');
        // Remove deselected guests
        let resp = await patchGoogleEvent(
          client,
          oldMeetingEvent.platform_event_id!,
          {
            attendees: existingAttendeesThatRemain,
          },
          false,
        );
        // Update the rest of the user, info, and send an email update
        resp = await patchGoogleEvent(
          client,
          oldMeetingEvent.platform_event_id!,
          {
            summary: title,
            description,
            attendees: attendeeArr,
            end: {
              dateTime: end_time,
              timeZone: timezone,
            },
            start: {
              dateTime: start_time,
              timeZone: timezone,
            },
          },
          true,
        );

        const { conferenceData, hangoutLink, id: gEventid } = resp.data;
        invariant(conferenceData && hangoutLink, 'Missing conferenceData and hangout link.');
        const entryPoints = conferenceData.entryPoints
        const phoneEntryPoint = find(entryPoints, { entryPointType: 'phone' })!;
        meeting_link = hangoutLink;
        phone_pin = phoneEntryPoint.pin!;
        [phone_country, phone] = phoneEntryPoint.label!.split(' ');
        platform_event_id = gEventid || undefined;
      }
      break;
    }
    case MeetingPlatform.MICROSOFT_TEAMS: {
      const oauthMicrosoft = await ctx.prisma.oauth.findFirst({
        where: {
          user_id: oldMeetingEvent.organizer_id,
          provider: OauthProvider.MICROSOFT,
        },
      });
      invariant(oauthMicrosoft, 'Invalid Microsoft oauth.');

      const existingAttendees = oldMeetingEvent.meetingAttendeeConnections.map((mac) => mac.user);
      const attendeeArr = [...attendee_emails.map((a) => ({ email: a }))];
      const existingAttendeesThatRemain = intersectionBy(existingAttendees, attendeeArr, 'email');

      const client = microsoftGraphClient(oauthMicrosoft.access_token);
      const response = await patchMicrosoftEvent(client, {
        subject: title,
        body: {
          content: description,
        },
        attendees: existingAttendeesThatRemain.map((a) => ({ emailAddress: { address: a.email } })),
        start: {
          dateTime: start_time,
          timeZone: timezone,
        },
        end: {
          dateTime: end_time,
          timeZone: timezone,
        },
      });

      const { id: mEventId, onlineMeeting, webLink } = response;
      meeting_link = onlineMeeting?.joinUrl || webLink as string;
      platform_event_id = mEventId;
      break;
    }
    default: {
      break;
    }
  }

  // Update meeting event record.
  const updatedMeetingEvent = await ctx.prisma.meetingEvent.update({
    data: {
      title,
      description,
      end_time,
      start_time,
      timezone,
      meeting_link,
      phone_pin,
      phone,
      phone_country,
      platform_event_id,
    },
    where: {
      id: meeting_event_id,
    },
    include: {
      project_connection: {
        include: {
          project_request: true,
        }
      },
      meetingAttendeeConnections: {
        include: {
          user: true,
        },
      },
      organizer: true,
    },
  });

  const notificationJob = {
    data: attendeeUsers
      .filter((u) => u.id !== updatedMeetingEvent.organizer_id)
      .map((u) => createUpdateMeetingNotificationJob({
        meeting_event_id: updatedMeetingEvent.id,
        organizer_full_name: `${updatedMeetingEvent.organizer.first_name} ${updatedMeetingEvent.organizer.last_name}`,
        project_title: updatedMeetingEvent.project_connection.project_request.title,
        recipient_id: u.id,
      })),
  }
  createNotificationQueueJob(notificationJob);

  return {
    ...updatedMeetingEvent,
    guests: updatedMeetingEvent.meetingAttendeeConnections.map((mac) => mac.user),
    project_request: {
      ...updatedMeetingEvent.project_connection.project_request,
      max_budget: updatedMeetingEvent.project_connection.project_request.max_budget?.toNumber() || 0,
    },
  };
}

type GetMicrosoftCalendarEventsArgs = {
  access_token: string;
  start_date_iso: string;
  end_date_iso?: string;
}

const getMicrosoftCalendarEvents = async (args: GetMicrosoftCalendarEventsArgs) => {
  const { access_token, start_date_iso, end_date_iso } = args;
  const client = microsoftGraphClient(access_token);

  try {
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
  } catch (error) {
    throw error;
  }
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

const getCalendarEventsForUser = async (
  user_id: string,
  start_date_iso: string,
  end_date_iso: string,
  ctx: ServiceContext
): Promise<CalendarEvent[]> => {
  let events: CalendarEvent[] = [];
  const oauthGoogle = await ctx.prisma.oauth.findFirst({
    where: {
      user_id,
      provider: OauthProvider.GOOGLE,
    },
  });

  if (oauthGoogle) {
    const googleEvents = await getGoogleCalendarEvents({
      access_token: oauthGoogle.access_token,
      refresh_token: oauthGoogle.refresh_token,
      single_events: true,
      start_date_iso,
      end_date_iso,
    });
    events = events.concat(googleEvents);
  }

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
        start_date_iso,
        end_date_iso,
      });
      events = events.concat(microsoftEvents);
    } catch (error: any) {
      if (error.statusCode === 401) {
        const newToken = await microsoftClientRefreshToken(oauthMicrosoft.access_token, oauthMicrosoft.refresh_token, user_id);
        const microsoftEvents = await getMicrosoftCalendarEvents({
          access_token: newToken.accessToken,
          start_date_iso,
          end_date_iso,
        });
        events = events.concat(microsoftEvents);
      }
    }
  }

  return events;
}

type GetAvailableTimeSlotsArgs = {
  date: Date;
  user_id: string;
  duration_in_min: number;
  attendee_user_ids: string[];
}

const getAvailableTimeSlots = async (args: GetAvailableTimeSlotsArgs, ctx: ServiceContext) => {
  const { date, user_id, duration_in_min, attendee_user_ids } = args;
  try {
    const startDateIso = moment(date).subtract(1, 'day').toISOString();
    const endDateIso = moment(date).add(1, 'day').toISOString();
    const calendarEventsPromises = [...attendee_user_ids, user_id].map(uid => getCalendarEventsForUser(uid, startDateIso, endDateIso, ctx));
    const allUsersEvents = await Promise.all(calendarEventsPromises);

    let freeSlotsGroupByUser = [];
    for (const userEvents of allUsersEvents) {
      const busySlots = processCalendarEvents(userEvents);
      let freeSlots = findFreeSlots(busySlots, date, duration_in_min);

      // Check if the date is today. If so, filter out past time slots
      if (moment(date).isSame(moment(), 'day')) {
        const currentTime = moment();
        freeSlots = freeSlots.filter(slot => moment(slot).isAfter(currentTime));
      }

      freeSlotsGroupByUser.push(freeSlots);
    }

    const commonFreeSlotsForAllUser = findCommonFreeSlotsForAllUser(freeSlotsGroupByUser);
    return commonFreeSlotsForAllUser;
  } catch (error) {
    throw error;
  }
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

const meetingEventService = {
  createMeetingEvent,
  removeMeetingEvent,
  updateMeetingEvent,
  getMicrosoftCalendarEvents,
  getGoogleCalendarEvents,
  getAvailableTimeSlots,
  addExternalGuestToMeeting,
};

export default meetingEventService;
