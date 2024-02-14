/*
  Warnings:

  - Added the required column `balance_amount` to the `blanket_purchase_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blanket_purchase_orders" ADD COLUMN     "balance_amount" DECIMAL(14,2) NOT NULL;
