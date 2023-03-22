import { find } from 'lodash';
import { createGoogleEvent } from "../../helper/googleCalendar";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { InternalError } from '../errors/InternalError';
import { MeetingPlatform } from '../../helper/constant';

const resolvers: Resolvers<Context> = {
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
    }
  },
  Mutation: {
    createMeetingEvent: async (parent, args, context) => {
      const { title, end_time, start_time, timezone, attendees, description } = args;

      const organizerUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        }
      });

      if (!organizerUser) {
        throw new InternalError('Current user not found');
      }

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

      const { conferenceData, hangoutLink } = resp.data;
      if (!conferenceData || !hangoutLink) {
        throw new InternalError('Missing conferenceData and hangout link');
      }
      const entryPoints = conferenceData.entryPoints
      const phoneEntryPoint = find(entryPoints, { entryPointType: 'phone' })!;

      const [countryCode, phone] = phoneEntryPoint.label!.split(' ');

      return await context.prisma.$transaction(async (trx) => {
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
          }
        });

        const attendeeUsers = await trx.user.findMany({
          where: {
            email: {
              in: attendees,
            },
          },
        });

        const data = [...attendeeUsers, organizerUser].map((u) => ({
          user_id: u.id,
          meeting_event_id: newMeetingEvent.id,
        }));

        await trx.meetingAttendeeConnection.createMany({
          data,
        });

        return newMeetingEvent;
      });
    }
  },
}

export default resolvers;
