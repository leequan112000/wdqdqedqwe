/*
  Warnings:

  - A unique constraint covering the columns `[biotech_invite_vendor_id]` on the table `project_connections` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "project_connections" ADD COLUMN     "biotech_invite_vendor_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "project_connections_biotech_invite_vendor_id_key" ON "project_connections"("biotech_invite_vendor_id");

-- AddForeignKey
ALTER TABLE "project_connections" ADD CONSTRAINT "project_connections_biotech_invite_vendor_id_fkey" FOREIGN KEY ("biotech_invite_vendor_id") REFERENCES "biotech_invite_vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
