/*
  Warnings:

  - Added the required column `expired_at` to the `quotes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "expired_at" TIMESTAMP(3);
UPDATE "quotes" SET "expired_at" = ("updated_at" + INTERVAL '7 days');
ALTER TABLE "quotes" ALTER COLUMN "expired_at" SET NOT NULL;
