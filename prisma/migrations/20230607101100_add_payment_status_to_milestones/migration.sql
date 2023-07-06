/*
  Warnings:

  - Added the required column `payment_status` to the `milestones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendor_payment_status` to the `milestones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "milestones" ADD COLUMN     "payment_status" TEXT NOT NULL,
ADD COLUMN     "vendor_payment_status" TEXT NOT NULL;
