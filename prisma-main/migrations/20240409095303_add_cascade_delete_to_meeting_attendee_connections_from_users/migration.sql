-- DropForeignKey
ALTER TABLE "meeting_attendee_connections" DROP CONSTRAINT "meeting_attendee_connections_user_id_fkey";

-- AddForeignKey
ALTER TABLE "meeting_attendee_connections" ADD CONSTRAINT "meeting_attendee_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
