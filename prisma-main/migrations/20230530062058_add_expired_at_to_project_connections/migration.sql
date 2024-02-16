-- AlterTable
ALTER TABLE "project_connections" ADD COLUMN     "expired_at" TIMESTAMP(3);
UPDATE "project_connections" SET "expired_at" = ("created_at" + INTERVAL '14 days');
