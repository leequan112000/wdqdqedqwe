/*
  Warnings:

  - You are about to drop the column `biotech_id` on the `project_requests` table. All the data in the column will be lost.
  - You are about to drop the column `vendor_company_id` on the `project_requests` table. All the data in the column will be lost.
  - You are about to drop the column `vendor_member_id` on the `project_requests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "project_requests" DROP CONSTRAINT "project_requests_biotech_id_fkey";

-- DropForeignKey
ALTER TABLE "project_requests" DROP CONSTRAINT "project_requests_vendor_company_id_fkey";

-- DropForeignKey
ALTER TABLE "project_requests" DROP CONSTRAINT "project_requests_vendor_member_id_fkey";

-- DropIndex
DROP INDEX "project_requests_biotech_id_idx";

-- DropIndex
DROP INDEX "project_requests_vendor_company_id_idx";

-- DropIndex
DROP INDEX "project_requests_vendor_member_id_idx";

-- AlterTable
ALTER TABLE "project_requests" DROP COLUMN "biotech_id",
DROP COLUMN "vendor_company_id",
DROP COLUMN "vendor_member_id";
