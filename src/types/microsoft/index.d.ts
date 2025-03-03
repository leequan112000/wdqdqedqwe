interface MicrosoftCalendarUser {
  emailAddress: {
    name: string;
    address: string;
  }
}

export interface MicrosoftCalendarEvent {
  id: string;
  subject: string;
  bodyPreview: string;
  webLink: string;
  isOnlineMeeting: boolean;
  onlineMeeting?: {
    joinUrl: string;
  };
  isDraft: boolean;
  isAllDay: boolean;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: MicrosoftCalendarUser[];
  organizer: MicrosoftCalendarUser;
}