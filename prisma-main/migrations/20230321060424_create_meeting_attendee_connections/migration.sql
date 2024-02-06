-- CreateTable
CREATE TABLE "meeting_attendee_connections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "meeting_event_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "meeting_attendee_connections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "meeting_attendee_connections" ADD CONSTRAINT "meeting_attendee_connections_meeting_event_id_fkey" FOREIGN KEY ("meeting_event_id") REFERENCES "meeting_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_attendee_connections" ADD CONSTRAINT "meeting_attendee_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
