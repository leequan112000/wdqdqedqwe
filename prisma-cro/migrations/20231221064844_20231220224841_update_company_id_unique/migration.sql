/*
  Warnings:

  - A unique constraint covering the columns `[company_id]` on the table `funding_info` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id]` on the table `linkedin_info` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id]` on the table `traffic_info` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id]` on the table `website_info` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "funding_info_company_id_key" ON "funding_info"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "linkedin_info_company_id_key" ON "linkedin_info"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "traffic_info_company_id_key" ON "traffic_info"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "website_info_company_id_key" ON "website_info"("company_id");
