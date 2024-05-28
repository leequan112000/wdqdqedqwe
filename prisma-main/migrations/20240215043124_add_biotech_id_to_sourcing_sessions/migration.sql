/*
  Warnings:

  - Added the required column `biotech_id` to the `sourcing_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sourcing_sessions" ADD COLUMN     "biotech_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "sourcing_sessions" ADD CONSTRAINT "sourcing_sessions_biotech_id_fkey" FOREIGN KEY ("biotech_id") REFERENCES "biotechs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
