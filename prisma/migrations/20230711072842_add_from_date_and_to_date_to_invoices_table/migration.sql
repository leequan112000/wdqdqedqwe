/*
  Warnings:

  - Added the required column `from_date` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_date` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "from_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "to_date" TIMESTAMP(3) NOT NULL;
