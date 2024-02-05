import { Prisma } from "@prisma/client";
import moment from "moment-timezone";
import { groupBy } from "lodash";
import {
  googleApiClient,
  googleClient,
  patchGoogleEvent,
} from "../../helper/googleCalendar";
import { Context } from "../../types/context";
import { CalendarEvent, Resolvers } from "../generated";
import { MeetingPlatform, OauthProvider } from "../../helper/constant";
import {
  microsoftClient,
  microsoftGraphClient,
  patchMicrosoftEvent,
} from "../../helper/microsoft";
import { codeChallenge, encryptOauthState } from "../../helper/oauth";
import invariant from "../../helper/invariant";
import meetingEventService from "../../services/meetingEvent/meetingEvent.service";
import { PublicError } from "../errors/PublicError";
import { meetingInvitationForGuestEmail } from "../../mailer/guestMeeting";
import { app_env } from "../../environment";
import {
  filterAvailableSlotsByDuration,
  findIntersectingIntervals,
  generateCalendarEventBusySlots,
  generateCommonAvailableSlots,
  generateDates,
} from "../../helper/availableTimeSlots";
import Sentry from "../../sentry";

const resolvers: Resolvers<Context> = {
  MeetingEvent: {
    phone_link: (parent) => {
      if (parent.phone_country && parent.phone)
        return `tel:${parent.phone_country}-${parent.phone}`;
      return null;
    },
    phone_pin: (parent) => {
      if (parent.phone_pin)
        return parent.phone_pin?.replace(/\d{3}(?=\d)/g, "$& ") + "#" || null;
      return null;
    },
    phone: (parent) => {
      if (parent.phone_country && parent.phone)
        return `${parent.phone_country} ${parent.phone}`;
      return null;
    },
    guests: async (parent, args, context) => {
      if (!parent.guests && parent.id) {
        const meetingAttendeeConnections =
          await context.prisma.meetingAttendeeConnection.findMany({
            where: {
              meeting_event_id: parent.id,
            },
            include: {
              user: true,
            },
          });
        return meetingAttendeeConnections.map((mac) => mac.user);
      }
      return parent.guests || [];
    },
    organizer: async (parent, args, context) => {
      invariant(parent.id, "Meeting event id not found.");

      const meetingEvent = await context.prisma.meetingEvent.findFirst({
        where: {
          id: parent.id,
        },
        include: {
          organizer: true,
        },
      });

      return await context.prisma.user.findFirst({
        where: {
          id: meetingEvent?.organizer_id,
        },
      });
    },
    project_request: async (parent, args, context) => {
      const initial = {
        in_contact_with_vendor: false,
        max_budget: 0,
        objective_description: "",
        status: "",
        title: "",
        vendor_requirement: "",
        vendor_search_timeframe: "",
        is_private: false,
      };
      if (!parent.project_request && parent.id) {
        const meetingEvent = await context.prisma.meetingEvent.findFirst({
          where: {
            id: parent.id,
          },
          include: {
            project_connection: {
              include: {
                project_request: true,
              },
            },
          },
        });
        return meetingEvent?.project_connection?.project_request
          ? {
              ...meetingEvent?.project_connection?.project_request,
              max_budget:
                meetingEvent?.project_connection?.project_request.max_budget?.toNumber() ||
                0,
            }
          : initial;
      }
      return parent.project_request || initial;
    },
    organizer_company_participants: async (parent, args, context) => {
      let organizerId = parent.organizer_id;
      if (!organizerId) {
        const meetingEvent = await context.prisma.meetingEvent.findFirst({
          where: {
            id: parent.id,
          },
        });
        invariant(meetingEvent, "Meeting not found.");
        organizerId = meetingEvent?.organizer_id;
      }
      const organizer = await context.prisma.user.findFirst({
        where: {
          id: organizerId,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      const organizerIsBiotech = !!organizer?.customer;
      const organizerIsVendor = !!organizer?.vendor_member;

      invariant(organizer, "Organizer not found.");
      const connections =
        await context.prisma.meetingAttendeeConnection.findMany({
          where: {
            meeting_event_id: parent.id,
          },
          include: {
            user: {
              include: {
                customer: true,
                vendor_member: true,
              },
            },
          },
        });

      const allParticipantUsers = connections.map((c) => c.user);

      return allParticipantUsers
        .filter((u) => {
          if (organizerIsBiotech && !!u.customer) return true;
          if (organizerIsVendor && !!u.vendor_member) return true;
          return false;
        })
        .map((u) => ({
          name: `${u.first_name} ${u.last_name}`,
          email: u.email,
          user_id: u.id,
        }));
    },
    attending_company_participants: async (parent, args, context) => {
      let organizerId = parent.organizer_id;
      if (!organizerId) {
        const meetingEvent = await context.prisma.meetingEvent.findFirst({
          where: {
            id: parent.id,
          },
        });
        invariant(meetingEvent, "Meeting not found.");
        organizerId = meetingEvent?.organizer_id;
      }
      const organizer = await context.prisma.user.findFirst({
        where: {
          id: organizerId,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      const organizerIsBiotech = !!organizer?.customer;
      const organizerIsVendor = !!organizer?.vendor_member;

      invariant(organizer, "Organizer not found.");
      const connections =
        await context.prisma.meetingAttendeeConnection.findMany({
          where: {
            meeting_event_id: parent.id,
          },
          include: {
            user: {
              include: {
                customer: true,
                vendor_member: true,
              },
            },
          },
        });

      const allParticipantUsers = connections.map((c) => c.user);

      return allParticipantUsers
        .filter((u) => {
          if (organizerIsBiotech && !!u.vendor_member) return true;
          if (organizerIsVendor && !!u.customer) return true;
          return false;
        })
        .map((u) => ({
          name: `${u.first_name} ${u.last_name}`,
          user_id: u.id,
          // do not include email because attending company email is hidden
        }));
    },
    external_guests: async (parent, args, context) => {
      const { id } = parent;
      invariant(id, "Missing id");
      const meetingGuests = await context.prisma.meetingGuest.findMany({
        where: {
          meeting_event_id: id,
        },
      });

      return meetingGuests.map((g) => ({
        email: g.email,
        name: g.name,
        status: g.status,
      }));
    },
    organizer_company: async (parent, args, context) => {
      const { organizer_id } = parent;

      invariant(organizer_id, "Organizer id is missing");

      const organizer = await context.prisma.user.findFirst({
        where: {
          id: organizer_id,
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

      invariant(organizer, "Organizer not found");

      if (organizer.customer) {
        return organizer.customer.biotech.name;
      }
      if (organizer.vendor_member?.vendor_company) {
        return organizer.vendor_member.vendor_company.name;
      }
      return null;
    },
    attending_company: async (parent, args, context) => {
      const { organizer_id, project_connection_id } = parent;

      invariant(organizer_id, "Missing organizer id.");

      const organizer = await context.prisma.user.findFirst({
        where: {
          id: organizer_id,
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

      invariant(project_connection_id, "Missing project connection id.");

      const projectConnection =
        await context.prisma.projectConnection.findFirst({
          where: {
            id: project_connection_id,
          },
          include: {
            vendor_company: true,
            project_request: {
              include: {
                biotech: true,
              },
            },
          },
        });

      invariant(projectConnection, "Project connection not found.");

      if (!!organizer?.customer) {
        return projectConnection.vendor_company.name;
      }

      if (!!organizer?.vendor_member) {
        return projectConnection.project_request.biotech.name;
      }

      return null;
    },
  },
  Query: {
    meetingFormAttendees: async (parent, args, context) => {
      invariant(context.req.user_id, "Current user id not found");

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      const customerConnections =
        await context.prisma.customerConnection.findMany({
          where: {
            project_connection_id: args.project_connection_id,
            customer: {
              user_id: {
                not: context.req.user_id,
              },
            },
          },
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        });
      const vendorConnections =
        await context.prisma.vendorMemberConnection.findMany({
          where: {
            project_connection_id: args.project_connection_id,
            vendor_member: {
              user_id: {
                not: context.req.user_id,
              },
            },
          },
          include: {
            vendor_member: {
              include: {
                user: true,
              },
            },
          },
        });

      return [
        ...customerConnections.map((c) => c.customer.user),
        ...vendorConnections.map((v) => v.vendor_member.user),
      ];
    },
    meetingEvents: async (parent, args, context) => {
      const { status } = args;

      const conditionalWhere: Prisma.MeetingEventWhereInput = {};

      switch (status) {
        case "ongoing": {
          conditionalWhere.end_time = {
            gte: new Date(),
          };
          break;
        }
        case "past": {
          conditionalWhere.end_time = {
            lt: new Date(),
          };
          break;
        }
        default:
      }

      const meetingEvents = await context.prisma.meetingEvent.findMany({
        where: {
          meetingAttendeeConnections: {
            some: {
              user_id: context.req.user_id,
            },
          },
          ...conditionalWhere,
        },
        include: {
          meetingAttendeeConnections: {
            include: {
              user: true,
            },
          },
          project_connection: {
            include: {
              project_request: true,
            },
          },
        },
        orderBy: {
          start_time: "desc",
        },
      });

      return meetingEvents.map((m) => ({
        ...m,
        guests: m.meetingAttendeeConnections.map((mac) => mac.user),
        project_request: {
          ...m.project_connection.project_request,
          max_budget:
            m.project_connection.project_request.max_budget?.toNumber() || 0,
        },
      }));
    },
    upcomingMeetingEvents: async (parent, args, context) => {
      const { project_connection_id } = args;
      const { user_id } = context.req;

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });

      invariant(currentUser, "Current user not found.");

      const checkStartTime = moment();

      const meetingEvents = await context.prisma.meetingEvent.findMany({
        where: {
          OR: [
            { organizer_id: currentUser.id },
            {
              meetingAttendeeConnections: {
                some: {
                  user_id: currentUser.id,
                },
              },
            },
          ],
          start_time: {
            gte: checkStartTime.toDate(),
          },
          project_connection_id: project_connection_id || undefined,
        },
        orderBy: {
          start_time: "asc",
        },
      });

      return meetingEvents;
    },
    availableDateTimeSlots: async (_, args, context) => {
      const {
        duration_in_min,
        from,
        to,
        timezone,
        attendee_user_ids,
        meeting_event_id,
      } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, "Missing user id.");

      const allParticipantUserIds = [
        ...((attendee_user_ids as string[]) || []),
        currentUserId,
      ];

      const existingMeetingEvent = meeting_event_id
        ? await context.prisma.meetingEvent.findFirst({
            where: {
              id: meeting_event_id,
            },
          })
        : undefined;

      const availabilities = await context.prisma.availability.findMany({
        where: {
          user_id: {
            in: allParticipantUserIds,
          },
        },
      });
      invariant(availabilities.length >= 0, "Availability not found.");

      const startDate = moment.tz(from, "YYYY-MM-DD", timezone);
      const endDate = moment.tz(to, "YYYY-MM-DD", timezone);

      const availabilityGroupByUser = availabilities.reduce<{
        [user_id: string]: { start_time: Date; end_time: Date }[];
      }>((acc, cur) => {
        const draft = Object.assign(acc);
        const startTime = moment
          .tz(cur.start_time, "h:mma", cur.timezone)
          .day(cur.day_of_week)
          .toDate();
        const endTime = moment
          .tz(cur.end_time, "h:mma", cur.timezone)
          .day(cur.day_of_week)
          .toDate();
        if (draft[cur.user_id] === undefined) {
          draft[cur.user_id] = [
            {
              start_time: startTime,
              end_time: endTime,
            },
          ];
        } else {
          draft[cur.user_id].push({
            start_time: startTime,
            end_time: endTime,
          });
        }
        return draft;
      }, {});

      const userIds = Object.keys(availabilityGroupByUser);
      let mutualAvailability: { start_time: Date; end_time: Date }[] =
        availabilityGroupByUser[userIds[0]];
      for (let i = 0; i < userIds.length - 1; i += 1) {
        const availability2 = availabilityGroupByUser[userIds[i + 1]];
        mutualAvailability = findIntersectingIntervals([
          ...mutualAvailability,
          ...availability2,
        ]);
      }

      /**
       * Split overnight availability. To make grouping easier.
       * Eg:
       * If start time is 2024-02-01 9:00PM and end time is 2024-02-02 9:00AM,
       * it will be split into 2 intervals as below:
       * {
       *    start_time: 2024-02-01 9:00PM,
       *    end_time: 2024-02-01 11:59PM,
       * }
       * {
       *    start_time: 2024-02-02 12:00AM,
       *    end_time: 2024-02-02 9:00AM,
       * }
       */
      const mutualAvailabilityWithoutOvernight = mutualAvailability.reduce<
        { start_time: Date; end_time: Date }[]
      >((acc, cur) => {
        /**
         * Set timezone as user's timezone here because overnight is viewed in user's timezone.
         */
        const startTime = moment(cur.start_time).tz(timezone);
        const endTime = moment(cur.end_time).tz(timezone);
        if (!startTime.isSame(endTime, "date")) {
          return [
            ...acc,
            {
              start_time: startTime.toDate(),
              end_time: startTime.clone().endOf("day").toDate(),
            },
            {
              start_time: endTime.clone().startOf("day").toDate(),
              end_time: endTime.toDate(),
            },
          ];
        }
        return [...acc, cur];
      }, []);

      const groupMutualAvailabilityByDayOfWeek =
        mutualAvailabilityWithoutOvernight.reduce<{
          [day_of_week: string]: { start_time: Date; end_time: Date }[];
        }>((acc, cur) => {
          const draft = Object.assign(acc);
          const dayOfWeek = moment(cur.start_time).tz(timezone).format("dddd");
          const startTime = moment(cur.start_time).tz(timezone).toDate();
          const endTime = moment(cur.end_time).tz(timezone).toDate();
          if (draft[dayOfWeek] === undefined) {
            draft[dayOfWeek] = [
              {
                start_time: startTime,
                end_time: endTime,
              },
            ];
          } else {
            draft[dayOfWeek].push({
              start_time: startTime,
              end_time: endTime,
            });
          }
          return draft;
        }, {});

      // Generate all date given start and end date
      const dateArr: string[] = generateDates(
        startDate.toDate(),
        endDate.toDate()
      );

      /**
       * Find available time slots for each day of week.
       * Not affected by calender event
       */
      const allCommonAvailableSlots = generateCommonAvailableSlots(
        groupMutualAvailabilityByDayOfWeek
      );

      // Filter slots based on the meeting duration
      const availableSlotsAfterDurationFilter = filterAvailableSlotsByDuration(
        allCommonAvailableSlots,
        duration_in_min
      );

      const getCalendarEventTasks = allParticipantUserIds.map(async (id) => {
        let calendarEvents: CalendarEvent[] = [];

        try {
          calendarEvents = await meetingEventService.getCalendarEventsForUser(
            {
              start_date_iso: startDate.toISOString(),
              end_date_iso: endDate.toISOString(),
              user_id: id,
            },
            {
              prisma: context.prisma,
            }
          );
        } catch (error) {
          Sentry.captureException(error);
        }

        return {
          userId: id,
          calendarEvents,
        };
      });
      const calendarEventDataArr = await Promise.all(getCalendarEventTasks);
      const calendarEventBusySlots =
        generateCalendarEventBusySlots(calendarEventDataArr);

      const dateWithAvailableTimeSlots = dateArr.map((d) => {
        const date = moment.tz(d, "YYYY-MM-DD", timezone);

        // Skip date if no availability on that day
        if (
          availableSlotsAfterDurationFilter[date.format("dddd")] === undefined
        ) {
          return {
            date: date.format("YYYY-MM-DD"),
            time_slots: [],
          };
        }

        // Make sure all time slots match the date.
        const timeSlots = availableSlotsAfterDurationFilter[
          date.format("dddd")
        ].map((interval) => ({
          start_time: moment(interval.start_time)
            .year(date.year())
            .month(date.month())
            .date(date.date()),
          end_time: moment(interval.end_time)
            .year(date.year())
            .month(date.month())
            .date(date.date()),
        }));

        // Filter time slots based on calendar event
        // Or if the time slot is selected by existing meeting event
        const selectedSlot = existingMeetingEvent
          ? {
              start_time: moment
                .tz(
                  existingMeetingEvent.start_time,
                  existingMeetingEvent.timezone
                )
                .toDate(),
              end_time: moment
                .tz(
                  existingMeetingEvent.end_time,
                  existingMeetingEvent.timezone
                )
                .toDate(),
            }
          : undefined;

        const now = moment();
        const finalTimeSlots = timeSlots.filter((slot) => {
          const isFutureTimeSlot = slot.start_time.isAfter(now);
          const isBusy = calendarEventBusySlots.some(
            (busySlot) =>
              moment(busySlot.start_time).isBefore(slot.end_time) &&
              moment(busySlot.end_time).isAfter(slot.start_time)
          );
          const isSelected =
            selectedSlot &&
            moment(selectedSlot.start_time).isSame(slot.start_time);

          return isFutureTimeSlot && (!isBusy || isSelected);
        });

        return {
          date: date.format("YYYY-MM-DD"),
          time_slots: finalTimeSlots.map((s) => s.start_time),
        };
      });

      return dateWithAvailableTimeSlots;
    },
    microsoftCalendarAuthorizationUri: async (_, args, context) => {
      const { redirect_url } = args;
      const { user_id } = context.req;
      invariant(user_id, "User ID not found.");

      const state = encryptOauthState({
        user_id,
        redirect_url: redirect_url || "",
      });

      const authorizationUri = microsoftClient.code.getUri({
        scopes: [
          "Calendars.ReadWrite OnlineMeetings.ReadWrite offline_access User.Read",
        ],
        state,
        query: {
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
        },
      });

      return authorizationUri;
    },
    microsoftCalendarEvents: async (_, __, context) => {
      const { user_id } = context.req;
      invariant(user_id, "User ID not found.");

      const oauth = await context.prisma.oauth.findFirst({
        where: {
          user_id,
          provider: OauthProvider.MICROSOFT,
        },
      });

      invariant(oauth, new PublicError("User not authenticated!"));

      const oneMonthAgo = moment().subtract(1, "months").toISOString();

      return await meetingEventService.getCalendarEventsForUser(
        {
          start_date_iso: oneMonthAgo,
          user_id,
          calendar: "microsoft",
        },
        {
          prisma: context.prisma,
        }
      );
    },
    googleCalendarAuthorizationUri: async (_, args, context) => {
      const { redirect_url } = args;
      const { user_id } = context.req;
      invariant(user_id, "User ID not found.");

      const state = encryptOauthState({
        user_id,
        redirect_url: redirect_url || "",
      });

      const authorizationUri = googleClient.code.getUri({
        scopes: ["https://www.googleapis.com/auth/calendar"],
        state,
        query: {
          access_type: "offline",
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
        },
      });

      return authorizationUri;
    },
    googleCalendarEvents: async (_, __, context) => {
      const { user_id } = context.req;
      invariant(user_id, "User ID not found.");

      const oauth = await context.prisma.oauth.findFirst({
        where: {
          user_id,
          provider: OauthProvider.GOOGLE,
        },
      });

      invariant(oauth, new PublicError("User not authenticated!"));

      const oneMonthAgo = moment().subtract(1, "months").toISOString();
      return await meetingEventService.getCalendarEventsForUser(
        {
          user_id,
          start_date_iso: oneMonthAgo,
          googleConfig: {
            single_events: false,
          },
        },
        { prisma: context.prisma }
      );
    },
    moreAttendeesToAdd: async (_, args, context) => {
      const attendeeConnections =
        await context.prisma.meetingAttendeeConnection.findMany({
          where: {
            meeting_event_id: args.meeting_event_id,
          },
        });

      const invitedUserIds = attendeeConnections.map((c) => c.user_id);

      const meetingEvent = await context.prisma.meetingEvent.findFirst({
        where: {
          id: args.meeting_event_id,
        },
      });

      invariant(meetingEvent, "Meeting event not found");

      const customerConnections =
        await context.prisma.customerConnection.findMany({
          where: {
            project_connection_id: meetingEvent.project_connection_id,
            customer: {
              user_id: {
                not: context.req.user_id,
                notIn: invitedUserIds,
              },
            },
          },
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        });
      const vendorMemberConnections =
        await context.prisma.vendorMemberConnection.findMany({
          where: {
            project_connection_id: meetingEvent.project_connection_id,
            vendor_member: {
              user_id: {
                not: context.req.user_id,
                notIn: invitedUserIds,
              },
            },
          },
          include: {
            vendor_member: {
              include: {
                user: true,
              },
            },
          },
        });

      return [
        ...customerConnections.map((c) => c.customer.user),
        ...vendorMemberConnections.map((v) => v.vendor_member.user),
      ];
    },
  },
  Mutation: {
    createMeetingEvent: async (parent, args, context) => {
      const currentUserId = context.req.user_id;

      invariant(currentUserId, "User ID not found.");

      return await context.prisma.$transaction(async (trx) => {
        return await meetingEventService.createMeetingEvent(
          {
            ...args,
            organizer_user_id: currentUserId,
          },
          { prisma: trx }
        );
      });
    },
    removeMeetingEvent: async (parent, args, context) => {
      const { meeting_event_id } = args;
      const currentUserId = context.req.user_id;

      invariant(currentUserId, "Missing current user id.");

      const meetingEvent = await context.prisma.meetingEvent.findFirst({
        where: {
          id: meeting_event_id,
        },
      });

      invariant(meetingEvent, "Meeting event not found.");

      const deletedMeetingEvent = await context.prisma.$transaction(
        async (trx) => {
          return await meetingEventService.removeMeetingEvent(
            { meeting_event_id, current_user_id: currentUserId },
            { prisma: trx }
          );
        }
      );

      return deletedMeetingEvent;
    },
    updateMeetingEventSharable: async (parent, args, context) => {
      const { is_sharable, meeting_event_id } = args;
      const meetingEvent = await context.prisma.meetingEvent.update({
        where: {
          id: meeting_event_id,
        },
        data: {
          is_sharable,
        },
      });

      return meetingEvent;
    },
    addMoreParticipants: async (_, args, context) => {
      const { cromatic_participants, external_participants, meeting_event_id } =
        args;

      const currentUserId = context.req.user_id;

      invariant(currentUserId, "Missing current user id.");

      const meetingEvent = await context.prisma.meetingEvent.findFirst({
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
        },
      });

      invariant(meetingEvent, "Meeting event not found");

      // Make sure the editor is the organizer.
      invariant(
        meetingEvent.organizer_id === currentUserId,
        "Current user is not organizer."
      );

      return await context.prisma.$transaction(async (trx) => {
        return meetingEventService.addParticipants(
          {
            cromatic_participants,
            external_participants,
            meeting_event_id,
            organizer_user_id: currentUserId,
          },
          {
            prisma: trx,
          }
        );
      });
    },
    sendGuestReminder: async (_, args, context) => {
      const { email, meeting_event_id } = args;

      const meetingGuest = await context.prisma.meetingGuest.findFirst({
        where: {
          email,
          meeting_event_id,
        },
        include: {
          meeting_event: {
            include: {
              project_connection: {
                include: {
                  project_request: true,
                },
              },
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
            },
          },
        },
      });

      invariant(meetingGuest, "Guest not found.");

      const meeting = meetingGuest.meeting_event;

      const companyName =
        meeting.organizer.customer?.biotech.name ||
        meeting.organizer.vendor_member?.vendor_company?.name;

      meetingInvitationForGuestEmail(
        {
          button_url: `${app_env.APP_URL}/meeting/${meeting.id}?authToken=${meetingGuest.id}`,
          company_name: companyName!,
          guest_name: meetingGuest.name || "guest",
          meeting_title: meeting.title,
          project_title: meeting.project_connection.project_request.title,
        },
        email
      );

      return true;
    },
    removeParticipant: async (_, args, context) => {
      const { user_id, meeting_event_id } = args;
      const currentUserId = context.req.user_id;

      invariant(currentUserId, "Current user id is missing.");

      const meetingEvent = await context.prisma.meetingEvent.findFirst({
        where: {
          id: meeting_event_id,
        },
        include: {
          meeting_guests: true,
        },
      });

      invariant(meetingEvent, "Meeting event not found.");

      invariant(
        meetingEvent.organizer_id === currentUserId,
        "Current user is not organizer."
      );

      await context.prisma.$transaction(async (trx) => {
        await meetingEventService.removeCromaticParticipant(
          {
            meeting_event_id,
            organizer_user_id: currentUserId,
            user_id,
          },
          {
            prisma: trx,
          }
        );
      });

      return true;
    },
    removeGuest: async (_, args, context) => {
      const { email, meeting_event_id } = args;
      const currentUserId = context.req.user_id;

      invariant(currentUserId, "Current user id is missing.");

      const meetingEvent = await context.prisma.meetingEvent.findFirst({
        where: {
          id: meeting_event_id,
        },
      });

      invariant(meetingEvent, "Meeting event not found.");

      invariant(
        meetingEvent.organizer_id === currentUserId,
        "Current user is not organizer."
      );

      await context.prisma.$transaction(async (trx) => {
        await trx.meetingGuest.deleteMany({
          where: {
            meeting_event_id,
          },
        });

        const existingAttendeeConnections =
          await trx.meetingAttendeeConnection.findMany({
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

        const existingExternalGuests = await trx.meetingGuest.findMany({
          where: {
            meeting_event_id,
          },
        });

        switch (meetingEvent.platform) {
          case MeetingPlatform.GOOGLE_MEET: {
            const oauthGoogle = await trx.oauth.findFirst({
              where: {
                user_id: currentUserId,
                provider: OauthProvider.GOOGLE,
              },
            });
            invariant(oauthGoogle, new PublicError("Missing token."));
            const client = googleApiClient(
              oauthGoogle.access_token,
              oauthGoogle.refresh_token
            );
            const attendeesArr = [
              ...existingAttendees.map((a) => ({ email: a.email })),
              ...existingExternalGuests.map((a) => ({ email: a.email })),
            ];

            await patchGoogleEvent(
              client,
              meetingEvent.platform_event_id!,
              { attendees: attendeesArr },
              true
            );
            break;
          }
          case MeetingPlatform.MICROSOFT_TEAMS: {
            const oauthMicrosoft = await trx.oauth.findFirst({
              where: {
                user_id: currentUserId,
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
            await patchMicrosoftEvent(client, {
              attendees: attendeesArr,
              id: meetingEvent.platform_event_id!,
            });
            break;
          }
          default:
        }
      });

      return true;
    },
    updateMeetingDetails: async (_, args, context) => {
      const {
        meeting_event_id,
        description,
        title,
        end_time,
        meeting_link,
        platform,
        start_time,
        timezone,
      } = args;
      const currentUserId = context.req.user_id;

      invariant(currentUserId, "Missing user id.");

      const updatedMeetingEvent = await context.prisma.$transaction(
        async (trx) => {
          return meetingEventService.updateMeetingEvent(
            {
              meeting_event_id,
              organizer_user_id: currentUserId,
              title: title || undefined,
              description: description || undefined,
              platform: platform || undefined,
              end_time: end_time || undefined,
              meeting_link: meeting_link || undefined,
              start_time: start_time || undefined,
              timezone: timezone || undefined,
            },
            { prisma: trx }
          );
        }
      );

      return updatedMeetingEvent;
    },
  },
};

export default resolvers;
