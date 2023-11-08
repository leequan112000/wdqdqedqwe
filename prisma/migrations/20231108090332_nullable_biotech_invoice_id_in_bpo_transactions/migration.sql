-- DropForeignKey
ALTER TABLE "blanket_purchase_order_transactions" DROP CONSTRAINT "blanket_purchase_order_transactions_biotech_invoice_id_fkey";

-- AlterTable
ALTER TABLE "blanket_purchase_order_transactions" ALTER COLUMN "biotech_invoice_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "blanket_purchase_order_transactions" ADD CONSTRAINT "blanket_purchase_order_transactions_biotech_invoice_id_fkey" FOREIGN KEY ("biotech_invoice_id") REFERENCES "biotech_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
