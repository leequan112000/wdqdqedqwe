import moment from "moment";
import invariant from "../../helper/invariant";
import { microsoftClientRefreshToken, microsoftGraphClient } from "../../helper/microsoft";
import { cancelGoogleEvent, googleApiClient, listGoogleEvents, patchGoogleEvent } from "../../helper/googleCalendar";
import { findCommonFreeSlotsForAllUser, findFreeSlots, processCalendarEvents } from "../../helper/timeSlot";
import { OauthProvider } from "../../helper/constant";
import { createRemoveMeetingNotificationJob, createUpdateMeetingNotificationJob } from "../../notification/meetingNotification";
import { createNotificationQueueJob } from "../../queues/notification.queues";
import { find, intersectionBy } from "lodash";
import { ServiceContext } from "../../types/context";
import { MicrosoftCalendarEvent } from "../../types/microsoft";
import { CalendarEvent } from "../../graphql/generated";

type RemoveMeetingEventArgs = {
  meeting_event_id: string;
}

const removeMeetingEvent = async (args: RemoveMeetingEventArgs, ctx: ServiceContext) => {
  const { meeting_event_id } = args;
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

  // Cancel Google event and inform the guests.
  await cancelGoogleEvent(deletedMeetingEvent.platform_event_id);

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

  // Patch Google event
  const existingAttendees = oldMeetingEvent.meetingAttendeeConnections.map((mac) => mac.user);
  const attendeeArr = [...attendee_emails.map((a) => ({ email: a }))];
  const existingAttendeesThatRemain = intersectionBy(existingAttendees, attendeeArr, 'email');
  // Remove deselected guests
  let resp = await patchGoogleEvent(oldMeetingEvent.platform_event_id!, {
    attendees: existingAttendeesThatRemain,
  }, false);
  // Update the rest of the user, info, and send an email update
  resp = await patchGoogleEvent(oldMeetingEvent.platform_event_id!, {
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
  }, true)
  const { conferenceData, hangoutLink } = resp.data;
  invariant(conferenceData && hangoutLink, 'Missing conferenceData and hangout link.');
  const entryPoints = conferenceData.entryPoints
  const phoneEntryPoint = find(entryPoints, { entryPointType: 'phone' })!;
  const [countryCode, phone] = phoneEntryPoint.label!.split(' ');

  // Update meeting event record.
  const updatedMeetingEvent = await ctx.prisma.meetingEvent.update({
    data: {
      title,
      description,
      end_time,
      start_time,
      timezone,
      meeting_link: hangoutLink,
      phone_pin: phoneEntryPoint.pin,
      phone: phone,
      phone_country: countryCode,
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
      const freeSlots = findFreeSlots(busySlots, date, duration_in_min);
      freeSlotsGroupByUser.push(freeSlots);
    }

    const commonFreeSlotsForAllUser = findCommonFreeSlotsForAllUser(freeSlotsGroupByUser);
    return commonFreeSlotsForAllUser;
  } catch (error) {
    throw error;
  }
}

const meetingEventService = {
  removeMeetingEvent,
  updateMeetingEvent,
  getMicrosoftCalendarEvents,
  getGoogleCalendarEvents,
  getAvailableTimeSlots,
};

export default meetingEventService;
