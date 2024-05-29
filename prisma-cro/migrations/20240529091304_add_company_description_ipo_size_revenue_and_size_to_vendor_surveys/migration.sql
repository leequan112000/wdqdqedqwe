/*
  Warnings:

  - Added the required column `company_description` to the `vendor_surveys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_ipo_status` to the `vendor_surveys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_revenue` to the `vendor_surveys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_size` to the `vendor_surveys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vendor_surveys" ADD COLUMN     "company_description" TEXT NOT NULL,
ADD COLUMN     "company_ipo_status" TEXT NOT NULL,
ADD COLUMN     "company_revenue" TEXT NOT NULL,
ADD COLUMN     "company_size" TEXT NOT NULL;
