/*
  Warnings:

  - You are about to drop the column `cda_pandadoc_view_session_expires_at` on the `biotechs` table. All the data in the column will be lost.
  - You are about to drop the column `cda_pandadoc_view_session_id` on the `biotechs` table. All the data in the column will be lost.
  - You are about to drop the column `cda_pandadoc_view_session_expires_at` on the `vendor_companies` table. All the data in the column will be lost.
  - You are about to drop the column `cda_pandadoc_view_session_id` on the `vendor_companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "biotechs" DROP COLUMN "cda_pandadoc_view_session_expires_at",
DROP COLUMN "cda_pandadoc_view_session_id";

-- AlterTable
ALTER TABLE "vendor_companies" DROP COLUMN "cda_pandadoc_view_session_expires_at",
DROP COLUMN "cda_pandadoc_view_session_id";
