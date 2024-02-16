/*
  Warnings:

  - The primary key for the `linkedin_info` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "company_specialties" DROP CONSTRAINT "company_specialties_linkedin_info_id_fkey";

-- DropForeignKey
ALTER TABLE "featured_employees" DROP CONSTRAINT "featured_employees_linkedin_info_id_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_linkedin_info_id_fkey";

-- AlterTable
ALTER TABLE "company_specialties" ALTER COLUMN "linkedin_info_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "featured_employees" ALTER COLUMN "linkedin_info_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "linkedin_info" DROP CONSTRAINT "linkedin_info_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "linkedin_info_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "linkedin_info_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "company_specialties" ADD CONSTRAINT "company_specialties_linkedin_info_id_fkey" FOREIGN KEY ("linkedin_info_id") REFERENCES "linkedin_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "featured_employees" ADD CONSTRAINT "featured_employees_linkedin_info_id_fkey" FOREIGN KEY ("linkedin_info_id") REFERENCES "linkedin_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_linkedin_info_id_fkey" FOREIGN KEY ("linkedin_info_id") REFERENCES "linkedin_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
