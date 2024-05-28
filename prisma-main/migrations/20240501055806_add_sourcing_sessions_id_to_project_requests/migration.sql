-- AlterTable
ALTER TABLE "project_requests" ADD COLUMN     "sourcing_session_id" UUID;

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
