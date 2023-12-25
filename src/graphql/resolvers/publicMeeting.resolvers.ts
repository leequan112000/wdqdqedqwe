import { MeetingGuest } from "@prisma/client";
import moment from "moment";
import { app_env } from "../../environment";
import invariant from "../../helper/invariant";
import {
  acceptedMeetingRSVPUpdateNotificationEmail,
  declinedMeetingRSVPNotificationForGuestEmail,
  declinedMeetingRSVPUpdateNotificationEmail,
  acceptedMeetingRSVPNotificationForGuestEmail,
} from "../../mailer/guestMeeting";
import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../generated";
import {
  InvitationAnswer,
  MeetingGuestStatus,
  MeetingGuestType,
} from "../../helper/constant";
import {
  createAcceptedMeetingRSVPNotification,
  createDeclinedMeetingRSVPNotification,
} from "../../notification/guestMeeting";
import { checkIfUserInProjectConnection } from "../../services/projectConnection/projectConnection.service";

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
          project_connection: {
            include: {
              project_request: true,
            },
          },
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

      const now = moment();
      const isEnded = now.isAfter(moment(meeting.end_time));

      return {
        id: meeting?.id,
        title: meeting?.title,
        start_time: meeting.start_time.toISOString(),
        end_time: meeting.end_time.toISOString(),
        organizer_name: `${meeting.organizer.first_name} ${meeting.organizer.last_name}`,
        guest_info: meetingGuest,
        meeting_link:
          !isEnded &&
          meetingGuest &&
          meetingGuest.status === MeetingGuestStatus.ACCEPTED
            ? meeting.meeting_link
            : null,
        project_title: meeting.project_connection.project_request.title,
        is_ended: isEnded,
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
          project_connection: {
            include: {
              project_request: true,
            },
          },
        },
      });

      invariant(meeting, new PublicError("Invalid token"));

      const now = moment();
      const isEnded = now.isAfter(moment(meeting.end_time));

      invariant(!isEnded, new PublicError("The meeting is already ended"));

      const existingUser = await context.prisma.user.findFirst({
        where: {
          email,
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
            prisma: context.prisma,
          }
        );
      }

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

      const guestButtonUrl = isPartOfProject
        ? `${app_env.APP_URL}/app/meeting-events`
        : `${app_env.APP_URL}/meeting/${meeting.id}?authToken=${meetingGuest.id}`;

      acceptedMeetingRSVPNotificationForGuestEmail(
        {
          button_url: guestButtonUrl,
          meeting_title: meeting.title,
          guest_name: name || "guest",
          project_title: meeting.project_connection.project_request.title,
        },
        email
      );
      acceptedMeetingRSVPUpdateNotificationEmail(
        {
          button_url: `${app_env.APP_URL}/app/meeting-events`,
          meeting_title: meeting.title,
          guest_name: name || "guest",
          host_name: `${meeting.organizer.first_name} ${meeting.organizer.last_name}`,
          project_title: meeting.project_connection.project_request.title,
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
          meeting_event: {
            include: {
              organizer: true,
              project_connection: {
                include: {
                  project_request: true,
                },
              },
            },
          },
        },
      });

      invariant(meetingGuest, new PublicError("Invalid response."));

      const now = moment();
      const isEnded = now.isAfter(moment(meetingGuest.meeting_event.end_time));

      invariant(!isEnded, new PublicError("The meeting is already ended"));

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

      const {
        organizer,
        id: meetingEventId,
        organizer_id,
      } = meetingGuest.meeting_event;
      const projectTitle =
        meetingGuest.meeting_event.project_connection.project_request.title;
      const guestName = name || "guest";
      // Send response confirmation email
      if (answer === InvitationAnswer.YES) {
        acceptedMeetingRSVPNotificationForGuestEmail(
          {
            button_url: `${app_env.APP_URL}/meeting/attendance/${meetingGuest.id}`,
            meeting_title: meetingGuest.meeting_event.title,
            guest_name: name || "guest",
            project_title:
              meetingGuest.meeting_event.project_connection.project_request
                .title,
          },
          updatedMeetingGuest.email
        );
        acceptedMeetingRSVPUpdateNotificationEmail(
          {
            button_url: `${app_env.APP_URL}/app/meeting-events`, // Todo: update the link to view meeting
            meeting_title: meetingGuest.meeting_event.title,
            guest_name: name || "guest",
            host_name: `${organizer.first_name} ${organizer.last_name}`,
            project_title:
              meetingGuest.meeting_event.project_connection.project_request
                .title,
          },
          organizer.email
        );
        createAcceptedMeetingRSVPNotification({
          guest_name: guestName,
          meeting_event_id: meetingEventId,
          project_title: projectTitle,
          recipient_id: organizer_id,
        });
      }
      if (answer === InvitationAnswer.NO) {
        declinedMeetingRSVPNotificationForGuestEmail(
          {
            meeting_title: meetingGuest.meeting_event.title,
            guest_name: name || "guest",
            host_name: `${organizer.first_name} ${organizer.last_name}`,
            project_title:
              meetingGuest.meeting_event.project_connection.project_request
                .title,
          },
          updatedMeetingGuest.email
        );
        declinedMeetingRSVPUpdateNotificationEmail(
          {
            button_url: `${app_env.APP_URL}/app/meeting-events`, // Todo: update the link to view meeting
            meeting_title: meetingGuest.meeting_event.title,
            guest_name: name || "guest",
            host_name: `${organizer.first_name} ${organizer.last_name}`,
            project_title:
              meetingGuest.meeting_event.project_connection.project_request
                .title,
          },
          organizer.email
        );
        createDeclinedMeetingRSVPNotification({
          guest_name: guestName,
          meeting_event_id: meetingEventId,
          project_title: projectTitle,
          recipient_id: organizer_id,
        });
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
