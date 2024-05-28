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
  MeetingPlatform,
  OauthProvider,
} from "../../helper/constant";
import {
  createAcceptedMeetingRSVPNotification,
  createDeclinedMeetingRSVPNotification,
} from "../../notification/guestMeeting";
import { checkIfUserInProjectConnection } from "../../services/projectConnection/projectConnection.service";
import meetingEventService from "../../services/meetingEvent/meetingEvent.service";

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
        platform: meeting.platform,
      };
    },
  },
  Mutation: {
    answerInvitation: async (parent, args, context) => {
      const { answer, meeting_token, guest_token, name, email } = args;

      const lowerCaseEmail = email.toLowerCase();

      const meetingEvent = await context.prisma.meetingEvent.findFirst({
        where: {
          id: meeting_token,
        },
        include: {
          organizer: true,
          project_connection: {
            include: {
              project_request: true,
            },
          },
          meeting_guests: true,
          meetingAttendeeConnections: {
            include: {
              user: true,
            },
          },
        },
      });

      invariant(meetingEvent, new PublicError("Invalid token"));

      const now = moment();
      const isEnded = now.isAfter(moment(meetingEvent.end_time));

      invariant(!isEnded, new PublicError("The meeting is already ended"));

      const existingUser = await context.prisma.user.findFirst({
        where: {
          email: {
            mode: 'insensitive',
            equals: lowerCaseEmail,
          },
        },
      });
      let isPartOfProject = false;
      if (existingUser) {
        isPartOfProject = await checkIfUserInProjectConnection(
          {
            project_connection_id: meetingEvent.project_connection_id,
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
            email: lowerCaseEmail,
            meeting_event_id: meetingEvent.id,
          },
          id: guest_token || undefined,
        },
        create: {
          email: lowerCaseEmail,
          name: name ? name : null,
          meeting_event_id: meetingEvent.id,
          type: MeetingGuestType.LINK,
          status:
            answer === InvitationAnswer.YES
              ? MeetingGuestStatus.ACCEPTED
              : MeetingGuestStatus.DECLINED,
        },
        update: {
          name: name ? name : null,
          status:
            answer === InvitationAnswer.YES
              ? MeetingGuestStatus.ACCEPTED
              : MeetingGuestStatus.DECLINED,
        },
      });

      const { organizer, id: meetingEventId, organizer_id } = meetingEvent;
      const projectTitle =
        meetingEvent.project_connection.project_request.title;
      const guestName = name || "guest";

      // Send response confirmation email
      if (answer === InvitationAnswer.YES) {
        const buttonUrl = isPartOfProject
          ? `${app_env.APP_URL}/app/meeting-events`
          : `${app_env.APP_URL}/meeting/${meetingEvent.id}?authToken=${meetingGuest.id}`;
        acceptedMeetingRSVPNotificationForGuestEmail(
          {
            button_url: buttonUrl,
            meeting_title: meetingEvent.title,
            guest_name: name || "guest",
            project_title:
              meetingEvent.project_connection.project_request.title,
            host_name: `${organizer.first_name} ${organizer.last_name}`,
          },
          meetingGuest.email
        );
        acceptedMeetingRSVPUpdateNotificationEmail(
          {
            button_url: `${app_env.APP_URL}/app/meeting-events`,
            meeting_title: meetingEvent.title,
            guest_name: name || "guest",
            host_name: `${organizer.first_name} ${organizer.last_name}`,
            project_title:
              meetingEvent.project_connection.project_request.title,
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
            meeting_title: meetingEvent.title,
            guest_name: name || "guest",
            host_name: `${organizer.first_name} ${organizer.last_name}`,
            project_title:
              meetingEvent.project_connection.project_request.title,
          },
          meetingGuest.email
        );
        declinedMeetingRSVPUpdateNotificationEmail(
          {
            button_url: `${app_env.APP_URL}/app/meeting-events`,
            meeting_title: meetingEvent.title,
            guest_name: name || "guest",
            host_name: `${organizer.first_name} ${organizer.last_name}`,
            project_title:
              meetingEvent.project_connection.project_request.title,
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

      // Patch calendar event
      if (meetingEvent.platform !== MeetingPlatform.CUSTOM) {
        const existingAttendees = meetingEvent.meetingAttendeeConnections.map(
          (mac) => mac.user
        );
        const existingExternalGuests = meetingEvent.meeting_guests;
        switch (meetingEvent.platform) {
          case MeetingPlatform.GOOGLE_MEET: {
            const oauthGoogle = await context.prisma.oauth.findFirst({
              where: {
                user_id: meetingEvent.organizer_id,
                provider: OauthProvider.GOOGLE,
              },
            });
            invariant(oauthGoogle, new PublicError("Missing token."));

            const attendeesArr = [
              ...existingAttendees.map((a) => ({ email: a.email })),
              ...existingExternalGuests.map((a) => ({ email: a.email })),
              { email: lowerCaseEmail },
            ];

            await meetingEventService.safePatchGoogleEvent(
              {
                access_token: oauthGoogle.access_token,
                refresh_token: oauthGoogle.refresh_token,
                g_event: { attendees: attendeesArr },
                organizer_user_id: meetingEvent.organizer_id,
                platform_event_id: meetingEvent.platform_event_id!,
                send_updates: true,
              },
              context,
            );
            break;
          }
          case MeetingPlatform.MICROSOFT_TEAMS: {
            const oauthMicrosoft = await context.prisma.oauth.findFirst({
              where: {
                user_id: meetingEvent.organizer_id,
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
              { emailAddress: { address: lowerCaseEmail } },
            ];
            await meetingEventService.safePatchMicrosoftEvent(
              {
                access_token: oauthMicrosoft.access_token,
                refresh_token: oauthMicrosoft.refresh_token,
                event_data: {
                  attendees: attendeesArr,
                  id: meetingEvent.platform_event_id!,
                },
                organizer_user_id: meetingEvent.organizer_id,
              },
              context,
            );
            break;
          }
          default:
            break;
        }
      }

      return {
        name: meetingGuest.name,
        email: meetingGuest.email,
        status: meetingGuest.status,
        token: meetingGuest.id,
        meeting_link: meetingEvent.meeting_link,
        answer: answer,
      };
    },
  },
};

export default resolvers;
