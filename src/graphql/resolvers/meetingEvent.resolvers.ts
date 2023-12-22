import { Prisma, User } from "@prisma/client";
import { find } from "lodash";
import moment from "moment";
import { createGoogleEvent, googleClient } from "../../helper/googleCalendar";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { MeetingPlatform, OauthProvider } from "../../helper/constant";
import { microsoftClient, microsoftClientRefreshToken } from '../../helper/microsoft';
import { codeChallenge } from '../../helper/oauth';
import { createNewMeetingNotificationJob } from "../../notification/meetingNotification";
import { createNotificationQueueJob } from "../../queues/notification.queues";
import invariant from "../../helper/invariant";
import meetingEventService from "../../services/meetingEvent/meetingEvent.service";
import {
  meetingInvitationForCromaticUserWithinProjectEmail,
  meetingInvitationForGuestEmail,
} from "../../mailer/guestMeeting";
import { app_env } from "../../environment";
import { PublicError } from "../errors/PublicError";
import { checkIfUserInProjectConnection } from "../../services/projectConnection/projectConnection.service";

const resolvers: Resolvers<Context> = {
  MeetingEvent: {
    phone_link: (parent) => {
      return `tel:${parent.phone_country}-${parent.phone}`;
    },
    phone_pin: (parent) => {
      return parent.phone_pin?.replace(/\d{3}(?=\d)/g, "$& ") + "#" || null;
    },
    phone: (parent) => {
      return `${parent.phone_country} ${parent.phone}`;
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
          id: meetingEvent?.organizer?.id,
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
        return meetingEvent?.project_connection?.project_request ? {
          ...meetingEvent?.project_connection?.project_request,
          max_budget:
            meetingEvent?.project_connection?.project_request.max_budget?.toNumber() ||
            0,
        } : initial;
      }
      return parent.project_request || initial;
    },
    external_guests: async (parent, args, context) => {
      const { id } = parent;
      invariant(id, "Missing id");
      const meetingGuests = await context.prisma.meetingGuest.findMany({
        where: {
          meeting_event_id: id,
        },
      });

      return meetingGuests;
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

      const UPCOMING_DAYS = 1;
      const checkStartTime = moment();
      const checkEndTime = moment().add(UPCOMING_DAYS, "d").endOf("d");

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
            lte: checkEndTime.toDate(),
          },
          project_connection_id: project_connection_id || undefined,
        },
        orderBy: {
          start_time: "asc",
        },
      });

      return meetingEvents;
    },
    availableTimeSlots: async (_, args, context) => {
      const { date, attendee_user_ids, duration_in_min } = args;
      const { user_id } = context.req;
      invariant(user_id, 'User ID not found.');

      return meetingEventService.getAvailableTimeSlots({
        date,
        user_id,
        duration_in_min,
        attendee_user_ids: attendee_user_ids as string[]
      }, context);
    },
    microsoftCalendarAuthorizationUri: async (_, __, context) => {
      const { user_id } = context.req;
      invariant(user_id, 'User ID not found.');

      const authorizationUri = microsoftClient.code.getUri({
        scopes: ['Calendars.Read offline_access'],
        state: user_id,
        query: {
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
        },
      });

      return authorizationUri;
    },
    microsoftCalendarEvents: async (_, __, context) => {
      const { user_id } = context.req;
      invariant(user_id, 'User ID not found.');

      const oauth = await context.prisma.oauth.findFirst({
        where: {
          user_id,
          provider: OauthProvider.MICROSOFT,
        },
      });

      invariant(oauth, new PublicError('User not authenticated!'));

      const oneMonthAgo = moment().subtract(1, 'months').toISOString();
      try {
        return await meetingEventService.getMicrosoftCalendarEvents({
          access_token: oauth.access_token,
          start_date_iso: oneMonthAgo,
        });
      } catch (error: any) {
        if (error.statusCode === 401) {
          const newToken = await microsoftClientRefreshToken(oauth.access_token, oauth.refresh_token, user_id);
          return await meetingEventService.getMicrosoftCalendarEvents({
            access_token: newToken.accessToken,
            start_date_iso: oneMonthAgo,
          });
        }
        throw new PublicError('Something went wrong connecting to your calendar.');
      }
    },
    googleCalendarAuthorizationUri: async (_, __, context) => {
      const { user_id } = context.req;
      invariant(user_id, 'User ID not found.');

      const authorizationUri = googleClient.code.getUri({
        scopes: ['https://www.googleapis.com/auth/calendar'],
        state: user_id,
        query: {
          access_type: 'offline',
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
        },
      });

      return authorizationUri;
    },
    googleCalendarEvents: async (_, __, context) => {
      const { user_id } = context.req;
      invariant(user_id, 'User ID not found.');

      const oauth = await context.prisma.oauth.findFirst({
        where: {
          user_id,
          provider: OauthProvider.GOOGLE,
        },
      });

      invariant(oauth, new PublicError('User not authenticated!'));

      try {
        const oneMonthAgo = moment().subtract(1, 'months').toISOString();
        return await meetingEventService.getGoogleCalendarEvents({
          access_token: oauth.access_token,
          refresh_token: oauth.refresh_token,
          single_events: false,
          start_date_iso: oneMonthAgo,
        });
      } catch (error: any) {
        throw new PublicError('Something went wrong connecting to your calendar.');
      }
    },
  },
  Mutation: {
    createMeetingEvent: async (parent, args, context) => {
      const {
        title,
        end_time,
        start_time,
        timezone,
        attendees,
        description,
        project_connection_id,
      } = args;

      const organizerUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
      });

      invariant(organizerUser, "Current user not found.");

      let attendeeUsers: User[] = [];

      const newMeetingEvent = await context.prisma.$transaction(async (trx) => {
        // Create Google event.
        const attendeeArr = [
          ...attendees.map((a) => ({ email: a })),
          { email: organizerUser.email },
        ];
        const resp = await createGoogleEvent({
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
        const { conferenceData, hangoutLink, id: gEventId } = resp.data;
        invariant(
          conferenceData && hangoutLink,
          "Missing conferenceData and hangout link."
        );
        const entryPoints = conferenceData.entryPoints;
        const phoneEntryPoint = find(entryPoints, { entryPointType: "phone" })!;
        const [countryCode, phone] = phoneEntryPoint.label!.split(" ");

        // Find attendees. This NOT INCLUDE the organizer.
        attendeeUsers = await trx.user.findMany({
          where: {
            email: {
              in: attendees,
            },
          },
        });

        // Create meeting attendee connections.
        // Note that organizerUser is inserted here.
        const data = [...attendeeUsers, organizerUser].map((u) => ({
          user_id: u.id,
        }));

        // Create meeting event record.
        const newMeetingEvent = await trx.meetingEvent.create({
          data: {
            title,
            description,
            end_time,
            start_time,
            platform: MeetingPlatform.GOOGLE_MEET,
            timezone,
            meeting_link: hangoutLink,
            phone_pin: phoneEntryPoint.pin,
            phone: phone,
            phone_country: countryCode,
            project_connection_id,
            platform_event_id: gEventId,
            organizer_id: organizerUser.id,
            is_sharable: true,
            meetingAttendeeConnections: {
              create: data,
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

        return newMeetingEvent;
      });

      const notificationJob = {
        data: attendeeUsers.map((u) =>
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

      return newMeetingEvent;
    },
    updateMeetingEvent: async (parent, args, context) => {
      const {
        meeting_event_id,
        attendees,
        end_time,
        start_time,
        timezone,
        title,
        description,
      } = args;

      const updatedMeetingEvent = await context.prisma.$transaction(
        async (trx) => {
          return meetingEventService.updateMeetingEvent(
            {
              attendee_emails: attendees,
              end_time,
              meeting_event_id,
              start_time,
              timezone,
              title,
              description,
            },
            {
              prisma: trx,
            }
          );
        }
      );

      return updatedMeetingEvent;
    },
    removeMeetingEvent: async (parent, args, context) => {
      const { meeting_event_id } = args;

      const deletedMeetingEvent = await context.prisma.$transaction(
        async (trx) => {
          return await meetingEventService.removeMeetingEvent(
            { meeting_event_id },
            { prisma: trx }
          );
        }
      );

      return deletedMeetingEvent;
    },
    addExternalGuests: async (parent, args, context) => {
      const { guests, meeting_id } = args;

      const meeting = await context.prisma.meetingEvent.findFirst({
        where: {
          id: meeting_id,
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

      invariant(meeting, new PublicError("Invalid token."));

      const results = await context.prisma.$transaction(async (trx) => {
        const tasks = (guests || []).map(async (g) => {
          const existingUser = await trx.user.findFirst({
            where: {
              email: g.email,
            },
          });

          let isPartOfProject = false;
          if (existingUser) {
            isPartOfProject = await checkIfUserInProjectConnection(
              {
                project_connection_id: meeting.project_connection_id,
                user_id: existingUser.id,
              },
              {
                prisma: trx,
              }
            );
          }

          // Take name of existing user from our DB
          const guestName = existingUser
            ? `${existingUser.first_name} ${existingUser.last_name}`
            : g.name;

          const updatedGuest = await trx.meetingGuest.upsert({
            where: {
              email_meeting_event_id: {
                email: g.email,
                meeting_event_id: meeting_id,
              },
            },
            create: {
              email: g.email,
              name: guestName || null,
              type: "invite",
              status: "pending",
              meeting_event_id: meeting_id,
            },
            update: {},
          });

          return {
            ...updatedGuest,
            is_part_of_project: isPartOfProject,
          };
        });

        return Promise.all(tasks);
      });

      const companyName =
        meeting.organizer.customer?.biotech?.name ||
        meeting.organizer.vendor_member?.vendor_company?.name;

      results.map((r) => {
        if (r.is_part_of_project) {
          meetingInvitationForCromaticUserWithinProjectEmail(
            {
              button_url: `${app_env.APP_URL}/app/meeting-events`,
              company_name: companyName!,
              guest_name: r.name || "guest",
              meeting_title: meeting.title,
              project_title: meeting.project_connection.project_request.title,
            },
            r.email
          );
        } else {
          meetingInvitationForGuestEmail(
            {
              button_url: `${app_env.APP_URL}/meeting/${meeting.id}?authToken=${r.id}`,
              company_name: companyName!,
              guest_name: r.name || "guest",
              meeting_title: meeting.title,
              project_title: meeting.project_connection.project_request.title,
            },
            r.email
          );
        }
      });

      return results;
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
  },
};

export default resolvers;
