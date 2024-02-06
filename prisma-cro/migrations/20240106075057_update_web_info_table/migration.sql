/*
  Warnings:

  - Added the required column `specialties` to the `website_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "website_info" ADD COLUMN     "specialties" TEXT NOT NULL;
