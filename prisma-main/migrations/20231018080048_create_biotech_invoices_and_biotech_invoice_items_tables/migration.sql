-- CreateTable
CREATE TABLE "biotech_invoices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invoice_number" TEXT NOT NULL,
    "biotech_id" UUID NOT NULL,
    "payment_status" TEXT NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "stripe_txn_id" TEXT,

    CONSTRAINT "biotech_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biotech_invoice_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "biotech_invoice_id" UUID NOT NULL,
    "milestone_id" UUID,

    CONSTRAINT "biotech_invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "biotech_invoice_items_milestone_id_key" ON "biotech_invoice_items"("milestone_id");

-- AddForeignKey
ALTER TABLE "biotech_invoices" ADD CONSTRAINT "biotech_invoices_biotech_id_fkey" FOREIGN KEY ("biotech_id") REFERENCES "biotechs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biotech_invoice_items" ADD CONSTRAINT "biotech_invoice_items_biotech_invoice_id_fkey" FOREIGN KEY ("biotech_invoice_id") REFERENCES "biotech_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biotech_invoice_items" ADD CONSTRAINT "biotech_invoice_items_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
