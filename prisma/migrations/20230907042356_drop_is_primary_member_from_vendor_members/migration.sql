/*
  Warnings:

  - You are about to drop the column `is_primary_member` on the `vendor_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vendor_members" DROP COLUMN "is_primary_member";
