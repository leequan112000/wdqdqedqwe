-- CreateTable
CREATE TABLE "company_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "document_type" INTEGER NOT NULL,
    "content_type" TEXT,
    "byte_size" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_company_id" UUID,
    "uploader_id" UUID,

    CONSTRAINT "company_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_attachments_key_key" ON "company_attachments"("key");

-- AddForeignKey
ALTER TABLE "company_attachments" ADD CONSTRAINT "company_attachments_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_attachments" ADD CONSTRAINT "company_attachments_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
