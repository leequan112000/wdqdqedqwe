-- DropForeignKey
ALTER TABLE "sourced_cros" DROP CONSTRAINT "sourced_cros_sourcing_session_id_fkey";

-- DropForeignKey
ALTER TABLE "sourcing_attachments" DROP CONSTRAINT "sourcing_attachments_sourcing_session_id_fkey";

-- DropForeignKey
ALTER TABLE "sourcing_subspecialties" DROP CONSTRAINT "sourcing_subspecialties_sourcing_session_id_fkey";

-- AddForeignKey
ALTER TABLE "sourcing_subspecialties" ADD CONSTRAINT "sourcing_subspecialties_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sourcing_attachments" ADD CONSTRAINT "sourcing_attachments_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sourced_cros" ADD CONSTRAINT "sourced_cros_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
