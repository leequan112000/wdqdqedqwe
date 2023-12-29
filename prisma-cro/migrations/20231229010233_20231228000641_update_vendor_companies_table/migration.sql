/*
  Warnings:

  - A unique constraint covering the columns `[specialty_id,linkedin_info_id]` on the table `company_specialties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employee_id,linkedin_info_id]` on the table `featured_employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[location_id,linkedin_info_id]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `specialty_id` to the `company_specialties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_id` to the `featured_employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_id` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crunchbase_url` to the `vendor_companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "company_specialties_id_linkedin_info_id_key";

-- DropIndex
DROP INDEX "featured_employees_id_linkedin_info_id_key";

-- DropIndex
DROP INDEX "locations_id_linkedin_info_id_key";

-- AlterTable
ALTER TABLE "company_specialties" ADD COLUMN     "specialty_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "featured_employees" ADD COLUMN     "employee_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "location_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vendor_companies" ADD COLUMN     "crunchbase_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "company_specialties_specialty_id_linkedin_info_id_key" ON "company_specialties"("specialty_id", "linkedin_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "featured_employees_employee_id_linkedin_info_id_key" ON "featured_employees"("employee_id", "linkedin_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_location_id_linkedin_info_id_key" ON "locations"("location_id", "linkedin_info_id");
