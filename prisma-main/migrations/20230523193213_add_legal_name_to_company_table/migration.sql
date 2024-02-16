/*
  Warnings:

  - A unique constraint covering the columns `[legal_name]` on the table `biotechs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[legal_name]` on the table `vendor_companies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "biotechs" ADD COLUMN     "legal_name" TEXT;

-- AlterTable
ALTER TABLE "vendor_companies" ADD COLUMN     "legal_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "biotechs_legal_name_key" ON "biotechs"("legal_name");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_companies_legal_name_key" ON "vendor_companies"("legal_name");
