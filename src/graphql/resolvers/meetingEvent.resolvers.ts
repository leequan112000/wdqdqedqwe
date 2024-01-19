import { Prisma } from "@prisma/client";
import moment from "moment-timezone";
import {
  googleApiClient,
  googleClient,
  patchGoogleEvent,
} from "../../helper/googleCalendar";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import {
  AvailabilityDay,
  MeetingGuestStatus,
  MeetingPlatform,
  OauthProvider,
} from "../../helper/constant";
import {
  microsoftClient,
  microsoftClientRefreshToken,
  microsoftGraphClient,
  patchMicrosoftEvent,
} from "../../helper/microsoft";
import { codeChallenge, encryptOauthState } from "../../helper/oauth";
import invariant from "../../helper/invariant";
import meetingEventService from "../../services/meetingEvent/meetingEvent.service";
import { PublicError } from "../errors/PublicError";
import { meetingInvitationForGuestEmail } from "../../mailer/guestMeeting";
import { app_env } from "../../environment";

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
      function findIntersectingIntervals(
        arr: Array<{ start_time: Date; end_time: Date }>
      ) {
        arr.sort((a, b) => {
          if (
            moment(a.start_time, "h:mma").isBefore(
              moment(b.start_time, "h:mma")
            )
          )
            return -1;
          if (
            moment(a.start_time, "h:mma").isAfter(moment(b.start_time, "h:mma"))
          )
            return 1;
          return 0;
        });

        const result: typeof arr = [];

        if (arr.length === 1) {
          result.push(arr[0]);
        } else {
          let intersect: { start_time: Date; end_time: Date } | undefined =
            undefined;
          for (let i = 0; i < arr.length - 1; i++) {
            const interval1: { start_time: Date; end_time: Date } =
              intersect || arr[i];
            const interval2 = arr[i + 1];

            const start1 = moment(interval1.start_time, "h:mma");
            const end1 = moment(interval1.end_time, "h:mma");
            const start2 = moment(interval2.start_time, "h:mma");
            const end2 = moment(interval2.end_time, "h:mma");
            if (end1.isSameOrAfter(start2) && end2.isSameOrAfter(start1)) {
              const intersectStart = moment.max(start1, start2);
              const intersectEnd = moment.min(end1, end2);

              intersect = {
                start_time: intersectStart.toDate(),
                end_time: intersectEnd.toDate(),
              };
            } else if (intersect) {
              result.push(intersect);
              intersect = undefined;
            } else {
              result.push(interval1);
            }

            /**
             * If comparing last 2 items, is either they are intersecting or not.
             * If intersecting, keep the intersection.
             * If not, keep both interval.
             */
            if (i === arr.length - 2) {
              if (intersect) {
                result.push(intersect);
              } else {
                result.push(interval2);
              }
            }
          }
        }

        return result;
      }

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

      // Group time by day of week
      const availabilityGroupByDayOfWeek = availabilities.reduce<{
        [x: string]: { start_time: Date; end_time: Date }[];
      }>((acc, cur) => {
        const draft = acc;
        if (draft[cur.day_of_week] === undefined) {
          draft[cur.day_of_week] = [
            {
              start_time: moment
                .tz(cur.start_time, "h:mma", cur.timezone)
                .toDate(),
              end_time: moment.tz(cur.end_time, "h:mma", cur.timezone).toDate(),
            },
          ];
        } else {
          draft[cur.day_of_week].push({
            start_time: moment
              .tz(cur.start_time, "h:mma", cur.timezone)
              .toDate(),
            end_time: moment.tz(cur.end_time, "h:mma", cur.timezone).toDate(),
          });
        }
        return draft;
      }, {});

      // Find intersecting available time.
      // These are the time when all participants are available.
      let intersectingIntervals: typeof availabilityGroupByDayOfWeek = {};
      Object.keys(availabilityGroupByDayOfWeek).forEach((day) => {
        const times = availabilityGroupByDayOfWeek[day];

        const results = findIntersectingIntervals(times);
        intersectingIntervals[day] = results;
      });

      // Generate all date given start and end date
      const startDate = moment.tz(from, "YYYY-MM-DD", timezone);
      const endDate = moment.tz(to, "YYYY-MM-DD", timezone);
      const dateArr: string[] = [];
      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate)) {
        dateArr.push(currentDate.format("YYYY-MM-DD"));
        currentDate.add(1, "days");
      }

      /**
       * Find available time slots for each day of week.
       * Not affected by calender event
       */
      const allCommonAvailableSlots = Object.values(AvailabilityDay).reduce<{
        [x: string]: { start_time: Date; end_time: Date }[];
      }>((acc, cur) => {
        const dayIntervals = intersectingIntervals[cur];
        if (dayIntervals === undefined) {
          return { ...acc, [cur]: [] };
        }
        // Generate free slot
        const freeSlots = dayIntervals.reduce<
          { start_time: Date; end_time: Date }[]
        >((slotsAcc, interval) => {
          let slots = [];
          let start = moment(interval.start_time);
          if (start.get("minute") < 30) {
            start.minute(0);
          } else {
            start.minute(30);
          }
          let end = start.clone().add(30, "minutes");
          let endOfAvailableDay = moment(interval.end_time);
          while (start.isBefore(endOfAvailableDay)) {
            slots.push({
              start_time: start.toDate(),
              end_time: end.toDate(),
            });

            start.add(30, "minutes");
            end.add(30, "minutes");
          }

          return [...slotsAcc, ...slots];
        }, []);

        const draft = { ...acc, [cur]: freeSlots };
        return draft;
      }, {});

      // Filter slots based on the meeting duration
      const availableSlotsAfterDurationFilter = Object.values(
        AvailabilityDay
      ).reduce<{
        [x: string]: { start_time: Date; end_time: Date }[];
      }>((acc, cur) => {
        const slots = allCommonAvailableSlots[cur];
        if (slots === undefined) {
          return { ...acc, [cur]: [] };
        }

        const filteredSlots: { start_time: Date; end_time: Date }[] = [];

        for (let i = 0; i < slots.length; i++) {
          let currentSlot = slots[i];
          let endTimeForDuration = moment(currentSlot.start_time).add(
            duration_in_min,
            "minutes"
          );

          // Check if the duration fits in the consecutive free slots
          let fitsDuration = false;
          for (let j = i; j < slots.length; j++) {
            if (endTimeForDuration.isSameOrBefore(slots[j].end_time)) {
              fitsDuration = true;
              break;
            }
          }

          if (fitsDuration) {
            filteredSlots.push(currentSlot);
          }
        }
        const draft = { ...acc, [cur]: filteredSlots };
        return draft;
      }, {});

      // TODO: Filter slots based on Calendar event
      const getCalendarEventTasks = allParticipantUserIds.map(async (id) => {
        const calendarEvents =
          await meetingEventService.getCalendarEventsForUser(
            {
              start_date_iso: startDate.toISOString(),
              end_date_iso: endDate.toISOString(),
              user_id: id,
            },
            {
              prisma: context.prisma,
            }
          );
        return {
          userId: id,
          calendarEvents,
        };
      });
      const calendarEventDataArr = await Promise.all(getCalendarEventTasks);
      const calendarEventBusySlots = calendarEventDataArr.reduce<
        { start_time: Date; end_time: Date }[]
      >((acc, eventData) => {
        const { calendarEvents } = eventData;
        const busySlots: { start_time: Date; end_time: Date }[] = [];
        calendarEvents.forEach((event) => {
          const current = event.timezone
            ? moment.tz(event.start_time, event.timezone)
            : moment.tz(event.start_time);

          const eventEndTime = event.timezone
            ? moment.tz(event.end_time, event.timezone)
            : moment.tz(event.end_time);

          while (current.isBefore(eventEndTime)) {
            let end = current.clone().add(30, "minutes");

            if (end.isAfter(eventEndTime)) {
              end = moment(eventEndTime);
            }

            busySlots.push({
              start_time: current.toDate(),
              end_time: end.toDate(),
            });
            current.add(30, "minutes");
          }
        });

        return [...acc, ...busySlots];
      }, []);

      const promises = dateArr.map(async (d) => {
        const date = moment(d, "YYYY-MM-DD");

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

        const finalTimeSlots = timeSlots.filter((slot) => {
          const isBusy = calendarEventBusySlots.some(
            (busySlot) =>
              moment(busySlot.start_time).isBefore(slot.end_time) &&
              moment(busySlot.end_time).isAfter(slot.start_time)
          );
          const isSelected =
            selectedSlot &&
            moment(selectedSlot.start_time).isSame(slot.start_time);

          return !isBusy || isSelected;
        });

        return {
          date: date.format("YYYY-MM-DD"),
          time_slots: finalTimeSlots.map((s) => s.start_time),
        };
      });

      const dateWithAvailableTimeSlots = await Promise.all(promises);

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
        scopes: ["Calendars.ReadWrite OnlineMeetings.ReadWrite offline_access"],
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
      try {
        return await meetingEventService.getMicrosoftCalendarEvents({
          access_token: oauth.access_token,
          refresh_token: oauth.refresh_token,
          start_date_iso: oneMonthAgo,
        });
      } catch (error: any) {
        if (error.statusCode === 401) {
          const newToken = await microsoftClientRefreshToken(
            oauth.access_token,
            oauth.refresh_token,
            user_id
          );
          return await meetingEventService.getMicrosoftCalendarEvents({
            access_token: newToken.accessToken,
            refresh_token: oauth.refresh_token,
            start_date_iso: oneMonthAgo,
          });
        }
        throw new PublicError(
          "Something went wrong connecting to your calendar."
        );
      }
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

      try {
        const oneMonthAgo = moment().subtract(1, "months").toISOString();
        return await meetingEventService.getGoogleCalendarEvents({
          access_token: oauth.access_token,
          refresh_token: oauth.refresh_token,
          single_events: false,
          start_date_iso: oneMonthAgo,
        });
      } catch (error: any) {
        throw new PublicError(
          "Something went wrong connecting to your calendar."
        );
      }
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
      const organizerUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
      });

      invariant(organizerUser, "Current user not found.");

      return await context.prisma.$transaction(async (trx) => {
        return await meetingEventService.createMeetingEvent(
          {
            ...args,
            organizer_user: organizerUser,
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
        const addExternalParticipantTasks = external_participants.map(
          async (p) => {
            const { email, name } = p;
            return await meetingEventService.addExternalGuestToMeeting(
              {
                email,
                name,
                meeting_event_id,
              },
              {
                prisma: trx,
              }
            );
          }
        );

        await Promise.all(addExternalParticipantTasks);

        const addInternalParticipantTasks = cromatic_participants.map(
          async (p) => {
            const userId = p.id!;

            const user = await trx.user.findFirst({
              where: {
                id: userId,
              },
            });
            await trx.meetingAttendeeConnection.create({
              data: {
                user_id: userId,
                meeting_event_id,
              },
            });

            return user;
          }
        );

        const cromaticUsers = await Promise.all(addInternalParticipantTasks);

        // Update attendees on calendar / video call app
        const existingAttendees = meetingEvent.meetingAttendeeConnections.map(
          (mac) => mac.user
        );
        const existingExternalGuests = meetingEvent.meeting_guests;

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
              ...cromatic_participants.map((a) => ({ email: a.email })),
              ...external_participants.map((a) => ({ email: a.email })),
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
              ...cromatic_participants.map((a) => ({
                emailAddress: { address: a.email },
              })),
              ...external_participants.map((a) => ({
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
        await trx.meetingAttendeeConnection.deleteMany({
          where: {
            meeting_event_id,
            user: {
              id: user_id,
            },
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

        const existingExternalGuests = meetingEvent.meeting_guests;

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
    updateMeetingDateTime: async (_, args, context) => {
      const { end_time, meeting_event_id, start_time, timezone } = args;
      const currentUserId = context.req.user_id;

      const meetingEvent = await context.prisma.meetingEvent.findFirst({
        where: {
          id: meeting_event_id,
        },
      });

      invariant(meetingEvent, "Meeting event not found.");

      const updatedMeetingEvent = await context.prisma.meetingEvent.update({
        where: {
          id: meeting_event_id,
        },
        data: {
          start_time,
          end_time,
        },
      });

      switch (meetingEvent.platform) {
        case MeetingPlatform.GOOGLE_MEET: {
          const oauthGoogle = await context.prisma.oauth.findFirst({
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

          await patchGoogleEvent(
            client,
            meetingEvent.platform_event_id!,
            {
              start: {
                dateTime: start_time,
                timeZone: timezone,
              },
              end: {
                dateTime: end_time,
                timeZone: timezone,
              },
            },
            true
          );
          break;
        }
        case MeetingPlatform.MICROSOFT_TEAMS: {
          const oauthMicrosoft = await context.prisma.oauth.findFirst({
            where: {
              user_id: currentUserId,
              provider: OauthProvider.MICROSOFT,
            },
          });

          invariant(oauthMicrosoft, new PublicError("Missing token."));
          const client = microsoftGraphClient(oauthMicrosoft.access_token);
          await patchMicrosoftEvent(client, {
            start: {
              dateTime: start_time,
              timeZone: timezone,
            },
            end: {
              dateTime: end_time,
              timeZone: timezone,
            },
            id: meetingEvent.platform_event_id!,
          });
          break;
        }
        default:
      }

      return updatedMeetingEvent;
    },
    updateMeetingDetails: async (_, args, context) => {
      const { meeting_event_id, description, title } = args;
      const currentUserId = context.req.user_id;

      const meetingEvent = await context.prisma.meetingEvent.findFirst({
        where: {
          id: meeting_event_id,
        },
      });

      invariant(meetingEvent, "Meeting event not found.");

      const updatedMeetingEvent = await context.prisma.meetingEvent.update({
        where: {
          id: meeting_event_id,
        },
        data: {
          title: title || undefined,
          description: description || undefined,
        },
      });

      switch (meetingEvent.platform) {
        case MeetingPlatform.GOOGLE_MEET: {
          const oauthGoogle = await context.prisma.oauth.findFirst({
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

          await patchGoogleEvent(
            client,
            meetingEvent.platform_event_id!,
            {
              ...(title ? { summary: title } : {}),
              ...(description ? { description } : {}),
            },
            true
          );
          break;
        }
        case MeetingPlatform.MICROSOFT_TEAMS: {
          const oauthMicrosoft = await context.prisma.oauth.findFirst({
            where: {
              user_id: currentUserId,
              provider: OauthProvider.MICROSOFT,
            },
          });

          invariant(oauthMicrosoft, new PublicError("Missing token."));
          const client = microsoftGraphClient(oauthMicrosoft.access_token);
          await patchMicrosoftEvent(client, {
            ...(title ? { subject: title } : {}),
            ...(description ? { description } : {}),
            id: meetingEvent.platform_event_id!,
          });
          break;
        }
        default:
      }

      return updatedMeetingEvent;
    },
    updateMeetingPlatform: async (_, args, context) => {
      const {
        meeting_event_id,
        platform: newPlatform,
        meeting_link: newMeetingLink,
      } = args;
      const currentUserId = context.req.user_id;

      invariant(currentUserId, "Missing current user id.");

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: currentUserId,
        },
      });

      invariant(currentUser, "Missing current user.");

      const previousMeetingEvent = await context.prisma.meetingEvent.findFirst({
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

      invariant(previousMeetingEvent, "Meeting event not found.");

      if (previousMeetingEvent.platform === newPlatform) {
        return previousMeetingEvent;
      }

      const existingCromaticParticipantsEmails =
        previousMeetingEvent.meetingAttendeeConnections.map(
          (u) => u.user.email
        );

      const existingExternalParticipantsEmails =
        previousMeetingEvent.meeting_guests.map((g) => g.email);

      const newMeetingEvent = await context.prisma.$transaction(async (trx) => {
        if (newPlatform === MeetingPlatform.CUSTOM) {
          invariant(newMeetingLink, "Missing new meeting link");
          const updatedMeetingEvent = await trx.meetingEvent.update({
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
          });
          await meetingEventService.removeMeetingEventOnCalendarApp(
            {
              current_user_id: currentUserId,
              platform: previousMeetingEvent.platform,
              platform_event_id: previousMeetingEvent.platform_event_id!,
            },
            { prisma: trx }
          );
          return updatedMeetingEvent;
        } else {
          const newMeetingEventOnCalendarApp =
            await meetingEventService.createMeetingEventOnCalendarApp(
              {
                end_time: previousMeetingEvent.end_time.toISOString(),
                start_time: previousMeetingEvent.start_time.toISOString(),
                platform: newPlatform,
                timezone: previousMeetingEvent.timezone,
                title: previousMeetingEvent.title,
                description: previousMeetingEvent.description || undefined,
                organizer_user_id: currentUserId,
                all_participants_emails: [
                  ...existingCromaticParticipantsEmails,
                  ...existingExternalParticipantsEmails,
                ],
              },
              { prisma: trx }
            );
          const updatedMeetingEvent = await trx.meetingEvent.update({
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
          });
          await meetingEventService.removeMeetingEventOnCalendarApp(
            {
              current_user_id: currentUserId,
              platform: previousMeetingEvent.platform,
              platform_event_id: previousMeetingEvent.platform_event_id!,
            },
            { prisma: trx }
          );
          return updatedMeetingEvent;
        }
      });

      return newMeetingEvent;
    },
  },
};

export default resolvers;
