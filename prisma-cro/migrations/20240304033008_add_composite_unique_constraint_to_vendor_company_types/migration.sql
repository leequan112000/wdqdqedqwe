/*
  Warnings:

  - A unique constraint covering the columns `[company_type,vendor_company_id]` on the table `vendor_company_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vendor_company_types_company_type_vendor_company_id_key" ON "vendor_company_types"("company_type", "vendor_company_id");
