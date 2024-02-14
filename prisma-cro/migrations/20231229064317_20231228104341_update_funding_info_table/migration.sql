/*
  Warnings:

  - A unique constraint covering the columns `[id,company_id]` on the table `funding_info` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "funding_info_id_company_id_key" ON "funding_info"("id", "company_id");
