-- AlterTable
ALTER TABLE "biotech_invite_vendors" ADD COLUMN     "project_request_id" UUID;

-- AddForeignKey
ALTER TABLE "biotech_invite_vendors" ADD CONSTRAINT "biotech_invite_vendors_project_request_id_fkey" FOREIGN KEY ("project_request_id") REFERENCES "project_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
