-- CreateTable
CREATE TABLE "biotech_invoice_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "document_type" INTEGER NOT NULL,
    "content_type" TEXT,
    "byte_size" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "biotech_invoice_id" UUID,
    "uploader_id" UUID,

    CONSTRAINT "biotech_invoice_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "biotech_invoice_attachments_key_key" ON "biotech_invoice_attachments"("key");

-- AddForeignKey
ALTER TABLE "biotech_invoice_attachments" ADD CONSTRAINT "biotech_invoice_attachments_biotech_invoice_id_fkey" FOREIGN KEY ("biotech_invoice_id") REFERENCES "biotech_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biotech_invoice_attachments" ADD CONSTRAINT "biotech_invoice_attachments_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
