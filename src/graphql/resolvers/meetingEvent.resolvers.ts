import { Prisma } from '@prisma/client';
import { find, intersectionBy } from 'lodash';
import moment from 'moment'
import { createGoogleEvent, patchGoogleEvent, cancelGoogleEvent } from "../../helper/googleCalendar";
import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { InternalError } from '../errors/InternalError';
import { MeetingPlatform } from '../../helper/constant';

const resolvers: Resolvers<Context> = {
  MeetingEvent: {
    phone_link: (parent) => {
      return `tel:${parent.phone_country}-${parent.phone}`;
    },
    phone_pin: (parent) => {
      return parent.phone_pin?.replace(/\d{3}(?=\d)/g, '$& ') + '#' || null;
    },
    phone: (parent) => {
      return `${parent.phone_country} ${parent.phone}`;
    },
    guests: async (parent, args, context) => {
      if (!parent.guests && parent.id) {
        const meetingAttendeeConnections = await context.prisma.meetingAttendeeConnection.findMany({
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
    project_request: async (parent, args, context) => {
      const initial = {
        in_contact_with_vendor: false,
        max_budget: 0,
        objective_description: '',
        status: '',
        title: '',
        vendor_requirement: '',
        vendor_search_timeframe: '',
      }
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
            max_budget: meetingEvent?.project_connection?.project_request.max_budget?.toNumber() || 0,
          }
          : initial;
      }
      return parent.project_request || initial;
    },
  },
  Query: {
    meetingFormAttendees: async (parent, args, context) => {
      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      const customerConnections = await context.prisma.customerConnection.findMany({
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
      const vendorConnections = await context.prisma.vendorMemberConnection.findMany({
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
      const { status } = args

      const conditionalWhere: Prisma.MeetingEventWhereInput = {}

      switch (status) {
        case 'ongoing': {
          conditionalWhere.end_time = {
            gte: new Date(),
          }
          break;
        }
        case 'past': {
          conditionalWhere.end_time = {
            lt: new Date(),
          }
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
            }
          }
        },
        orderBy: {
          start_time: 'desc',
        },
      });

      return meetingEvents.map((m) => ({
        ...m,
        guests: m.meetingAttendeeConnections.map((mac) => mac.user),
        project_request: {
          ...m.project_connection.project_request,
          max_budget: m.project_connection.project_request.max_budget?.toNumber() || 0,
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

      if (!currentUser) {
        throw new InternalError('Currect user not found');
      }

      const UPCOMING_DAYS = 1;
      const checkStartTime = moment();
      const checkEndTime = moment().add(UPCOMING_DAYS, 'd').endOf('d');

      const meetingEvents = await context.prisma.meetingEvent.findMany({
        where: {
          OR: [
            { organizer_id: currentUser.id },
            {
              meetingAttendeeConnections: {
                some: {
                  user_id: currentUser.id,
                }
              }
            },
          ],
          start_time: {
            gte: checkStartTime.toDate(),
            lte: checkEndTime.toDate(),
          },
          project_connection_id: project_connection_id || undefined,
        },
        orderBy: {
          start_time: 'asc',
        },
      });

      return meetingEvents;
    },
  },
  Mutation: {
    createMeetingEvent: async (parent, args, context) => {
      const { title, end_time, start_time, timezone, attendees, description, project_connection_id } = args;

      const organizerUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        }
      });

      if (!organizerUser) {
        throw new InternalError('Current user not found');
      }

      return await context.prisma.$transaction(async (trx) => {
        // Create Google event.
        const attendeeArr = [...attendees.map((a) => ({ email: a })), { email: organizerUser.email }];
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
        if (!conferenceData || !hangoutLink) {
          throw new InternalError('Missing conferenceData and hangout link');
        }
        const entryPoints = conferenceData.entryPoints
        const phoneEntryPoint = find(entryPoints, { entryPointType: 'phone' })!;
        const [countryCode, phone] = phoneEntryPoint.label!.split(' ');

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
          },
        });

        // Find attendees. This NOT INCLUDE the organizer.
        const attendeeUsers = await trx.user.findMany({
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
          meeting_event_id: newMeetingEvent.id,
        }));
        await trx.meetingAttendeeConnection.createMany({
          data,
        });

        return newMeetingEvent;
      });
    },
    updateMeetingEvent: async (parent, args, context) => {
      const { meeting_event_id, attendees, end_time, start_time, timezone, title, description } = args;
      const oldMeetingEvent = await context.prisma.meetingEvent.findFirst({
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

      if (!oldMeetingEvent?.platform_event_id) {
        throw new InternalError('Meeting event not found');
      }

      return await context.prisma.$transaction(async (trx) => {
        // Find all attendees. This INCLUDE the organizer.
        const attendeeUsers = await trx.user.findMany({
          where: {
            email: {
              in: attendees,
            },
          },
        });

        // Remove all and recreate meeting attendee connections.
        const data = [...attendeeUsers].map((u) => ({
          user_id: u.id,
          meeting_event_id: meeting_event_id,
        }));
        await trx.meetingAttendeeConnection.deleteMany({
          where: {
            meeting_event_id,
          },
        });
        await trx.meetingAttendeeConnection.createMany({
          data,
        });

        // Patch Google event
        const existingAttendees = oldMeetingEvent.meetingAttendeeConnections.map((mac) => mac.user);
        const attendeeArr = [...attendees.map((a) => ({ email: a }))];
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
        if (!conferenceData || !hangoutLink) {
          throw new InternalError('Missing conferenceData and hangout link');
        }
        const entryPoints = conferenceData.entryPoints
        const phoneEntryPoint = find(entryPoints, { entryPointType: 'phone' })!;
        const [countryCode, phone] = phoneEntryPoint.label!.split(' ');

        // Update meeting event record.
        const updatedMeetingEvent = await trx.meetingEvent.update({
          data: {
            updated_at: new Date(),
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
          },
        });

        return {
          ...updatedMeetingEvent,
          guests: updatedMeetingEvent.meetingAttendeeConnections.map((mac) => mac.user),
          project_request: {
            ...updatedMeetingEvent.project_connection.project_request,
            max_budget: updatedMeetingEvent.project_connection.project_request.max_budget?.toNumber() || 0,
          },
        };
      });
    },
    removeMeetingEvent: async (parent, args, context) => {
      const { meeting_event_id } = args;
      return await context.prisma.$transaction(async (trx) => {
        // Delete all meeting attendee connections.
        await trx.meetingAttendeeConnection.deleteMany({
          where: {
            meeting_event_id,
          },
        });
        // Delete meeting event record.
        const deletedMeetingEvent = await trx.meetingEvent.delete({
          where: {
            id: meeting_event_id,
          },
        });

        if (!deletedMeetingEvent?.platform_event_id) {
          throw new InternalError('Meeting event not found');
        }

        // Cancel Google event and inform the guests.
        await cancelGoogleEvent(deletedMeetingEvent.platform_event_id);

        return deletedMeetingEvent;
      })
    },
  },
}

export default resolvers;
