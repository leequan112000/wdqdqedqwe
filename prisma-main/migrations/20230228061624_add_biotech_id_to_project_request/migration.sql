/*
  Warnings:

  - Added the required column `biotech_id` to the `project_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project_requests" ADD COLUMN     "biotech_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_biotech_id_fkey" FOREIGN KEY ("biotech_id") REFERENCES "biotechs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
