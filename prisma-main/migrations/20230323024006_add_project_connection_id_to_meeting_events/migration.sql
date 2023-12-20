/*
  Warnings:

  - Added the required column `project_connection_id` to the `meeting_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meeting_events" ADD COLUMN     "project_connection_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "meeting_events" ADD CONSTRAINT "meeting_events_project_connection_id_fkey" FOREIGN KEY ("project_connection_id") REFERENCES "project_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
