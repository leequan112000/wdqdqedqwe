/*
  Warnings:

  - A unique constraint covering the columns `[id,linkedin_info_id]` on the table `company_specialties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,linkedin_info_id]` on the table `featured_employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,linkedin_info_id]` on the table `locations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "company_specialties_id_linkedin_info_id_key" ON "company_specialties"("id", "linkedin_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "featured_employees_id_linkedin_info_id_key" ON "featured_employees"("id", "linkedin_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_id_linkedin_info_id_key" ON "locations"("id", "linkedin_info_id");
