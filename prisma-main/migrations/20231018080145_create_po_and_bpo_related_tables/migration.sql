-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "po_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "biotech_invoice_id" UUID NOT NULL,
    "biotech_id" UUID NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blanket_purchase_orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "po_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "biotech_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blanket_purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blanket_purchase_order_transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DECIMAL(14,2) NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "blanket_purchase_order_id" UUID NOT NULL,
    "biotech_invoice_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blanket_purchase_order_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_biotech_invoice_id_key" ON "purchase_orders"("biotech_invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_biotech_id_po_number_key" ON "purchase_orders"("biotech_id", "po_number");

-- CreateIndex
CREATE UNIQUE INDEX "blanket_purchase_orders_biotech_id_po_number_key" ON "blanket_purchase_orders"("biotech_id", "po_number");

-- CreateIndex
CREATE UNIQUE INDEX "blanket_purchase_order_transactions_biotech_invoice_id_key" ON "blanket_purchase_order_transactions"("biotech_invoice_id");

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_biotech_invoice_id_fkey" FOREIGN KEY ("biotech_invoice_id") REFERENCES "biotech_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_biotech_id_fkey" FOREIGN KEY ("biotech_id") REFERENCES "biotechs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blanket_purchase_orders" ADD CONSTRAINT "blanket_purchase_orders_biotech_id_fkey" FOREIGN KEY ("biotech_id") REFERENCES "biotechs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blanket_purchase_order_transactions" ADD CONSTRAINT "blanket_purchase_order_transactions_blanket_purchase_order_fkey" FOREIGN KEY ("blanket_purchase_order_id") REFERENCES "blanket_purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blanket_purchase_order_transactions" ADD CONSTRAINT "blanket_purchase_order_transactions_biotech_invoice_id_fkey" FOREIGN KEY ("biotech_invoice_id") REFERENCES "biotech_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blanket_purchase_order_transactions" ADD CONSTRAINT "blanket_purchase_order_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
