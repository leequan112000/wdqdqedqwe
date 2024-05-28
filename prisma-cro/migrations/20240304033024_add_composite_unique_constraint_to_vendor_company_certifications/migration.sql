/*
  Warnings:

  - A unique constraint covering the columns `[certification_name,vendor_company_id]` on the table `vendor_company_certifications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vendor_company_certifications_certification_name_vendor_com_key" ON "vendor_company_certifications"("certification_name", "vendor_company_id");
