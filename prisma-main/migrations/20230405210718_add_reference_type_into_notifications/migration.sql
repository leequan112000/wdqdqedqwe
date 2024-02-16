/*
  Warnings:

  - You are about to drop the column `refernece_type` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `reference_type` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "refernece_type",
ADD COLUMN     "reference_type" TEXT NOT NULL;
