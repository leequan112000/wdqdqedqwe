/*
  Warnings:

  - Made the column `is_on_marketplace` on table `vendor_companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "vendor_companies" ALTER COLUMN "is_on_marketplace" SET NOT NULL;
