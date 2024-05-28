/*
  Warnings:

  - A unique constraint covering the columns `[country,vendor_company_id]` on the table `vendor_company_locations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vendor_company_locations_country_vendor_company_id_key" ON "vendor_company_locations"("country", "vendor_company_id");
