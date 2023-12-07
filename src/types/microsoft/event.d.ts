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
  onlineMeetingUrl?: string;
  isOnlineMeeting: boolean;
  isDraft: boolean;
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