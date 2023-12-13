import { MeetingGuest } from "@prisma/client";
import { app_env } from "../../environment";
import invariant from "../../helper/invariant";
import {
  meetingRSVPUpdateNotificationEmail,
  meetingResponseSubmittedEmail,
} from "../../mailer/guestMeeting";
import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../generated";
import {
  InvitationAnswer,
  MeetingGuestStatus,
  MeetingGuestType,
} from "../../helper/constant";

const resolvers: Resolvers<Context> = {
  Query: {
    pubMeeting: async (parent, args, context) => {
      const { token, guest_token } = args;
      const meeting = await context.prisma.meetingEvent.findFirst({
        where: {
          id: token,
          is_sharable: true,
        },
        include: {
          organizer: true,
        },
      });

      invariant(meeting, new PublicError("Invalid token"));

      let meetingGuest: MeetingGuest | null = null;

      if (guest_token) {
        meetingGuest = await context.prisma.meetingGuest.findFirst({
          where: {
            id: guest_token,
          },
        });
      }

      return {
        id: meeting?.id,
        title: meeting?.title,
        start_time: meeting.start_time.toISOString(),
        organizer_name: `${meeting.organizer.first_name} ${meeting.organizer.last_name}`,
        guest_info: meetingGuest,
        meeting_link:
          meetingGuest && meetingGuest.status === MeetingGuestStatus.ACCEPTED
            ? meeting.meeting_link
            : null,
      };
    },
  },
  Mutation: {
    submitAttendance: async (parent, args, context) => {
      const { email, name, token } = args;

      const meeting = await context.prisma.meetingEvent.findFirst({
        where: {
          id: token,
          is_sharable: true,
        },
        include: {
          organizer: true,
        },
      });

      invariant(meeting, new PublicError("Invalid token"));

      const meetingGuest = await context.prisma.meetingGuest.upsert({
        where: {
          email_meeting_event_id: {
            email,
            meeting_event_id: meeting.id,
          },
        },
        create: {
          email,
          name: name ? name : null,
          meeting_event_id: meeting.id,
          type: MeetingGuestType.LINK,
          status: MeetingGuestStatus.ACCEPTED,
        },
        update: {
          name: name ? name : null,
        },
      });

      meetingResponseSubmittedEmail(
        {
          button_url: `${app_env.APP_URL}/meeting/${meeting.id}?authToken=${meetingGuest.id}`,
          meeting_title: meeting.title,
          guest_name: name || "guest",
        },
        email
      );
      meetingRSVPUpdateNotificationEmail(
        {
          button_url: `${app_env.APP_URL}/app/meeting`, // Todo: update the link to view meeting
          meeting_title: meeting.title,
          guest_name: name || "guest",
          host_name: `${meeting.organizer.first_name} ${meeting.organizer.last_name}`,
        },
        meeting.organizer.email
      );

      return {
        token: meetingGuest.id,
        status: meetingGuest.status,
        email,
        name,
        meeting_link: meeting.meeting_link,
      };
    },
    answerInvitation: async (parent, args, context) => {
      const { answer, token, name } = args;

      const meetingGuest = await context.prisma.meetingGuest.findFirst({
        where: {
          id: token,
        },
        include: {
          meeting_event: true,
        },
      });

      invariant(meetingGuest, new PublicError("Invalid response."));

      const updatedMeetingGuest = await context.prisma.meetingGuest.update({
        where: {
          id: token,
        },
        data: {
          status:
            answer === InvitationAnswer.YES
              ? MeetingGuestStatus.ACCEPTED
              : MeetingGuestStatus.DECLINED,
          name: name ? name : null,
        },
      });

      // Send response confirmation email
      if (answer === InvitationAnswer.YES) {
        meetingResponseSubmittedEmail(
          {
            button_url: `${app_env.APP_URL}/meeting/attendance/${meetingGuest.id}`,
            meeting_title: meetingGuest.meeting_event.title,
            guest_name: name || "guest",
          },
          updatedMeetingGuest.email
        );
      }

      return {
        name: updatedMeetingGuest.name,
        email: updatedMeetingGuest.email,
        status: updatedMeetingGuest.status,
        token: updatedMeetingGuest.id,
        meeting_link: meetingGuest.meeting_event.meeting_link,
        answer: answer,
      };
    },
  },
};

export default resolvers;
