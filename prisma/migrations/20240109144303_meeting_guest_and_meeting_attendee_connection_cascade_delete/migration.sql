-- DropForeignKey
ALTER TABLE "meeting_attendee_connections" DROP CONSTRAINT "meeting_attendee_connections_meeting_event_id_fkey";

-- DropForeignKey
ALTER TABLE "meeting_guests" DROP CONSTRAINT "meeting_guests_meeting_event_id_fkey";

-- AddForeignKey
ALTER TABLE "meeting_attendee_connections" ADD CONSTRAINT "meeting_attendee_connections_meeting_event_id_fkey" FOREIGN KEY ("meeting_event_id") REFERENCES "meeting_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_guests" ADD CONSTRAINT "meeting_guests_meeting_event_id_fkey" FOREIGN KEY ("meeting_event_id") REFERENCES "meeting_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
