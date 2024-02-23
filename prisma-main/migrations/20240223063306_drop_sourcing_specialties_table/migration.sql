/*
  Warnings:

  - You are about to drop the column `sourcing_specialty_id` on the `sourcing_subspecialties` table. All the data in the column will be lost.
  - You are about to drop the `sourcing_specialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sourcing_specialties" DROP CONSTRAINT "sourcing_specialties_sourcing_session_id_fkey";

-- DropForeignKey
ALTER TABLE "sourcing_subspecialties" DROP CONSTRAINT "sourcing_subspecialties_sourcing_specialty_id_fkey";

-- AlterTable
ALTER TABLE "sourcing_subspecialties" DROP COLUMN "sourcing_specialty_id";

-- DropTable
DROP TABLE "sourcing_specialties";
