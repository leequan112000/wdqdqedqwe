/*
  Warnings:

  - A unique constraint covering the columns `[subspecialty_id,vendor_company_id]` on the table `vendor_company_subspecialties` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vendor_company_subspecialties_subspecialty_id_vendor_compan_key" ON "vendor_company_subspecialties"("subspecialty_id", "vendor_company_id");
