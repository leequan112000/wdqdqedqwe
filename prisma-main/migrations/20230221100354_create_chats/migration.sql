-- CreateTable
CREATE TABLE "chats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "biotech_id" UUID NOT NULL,
    "vendor_company_id" UUID NOT NULL,
    "project_connection_id" UUID NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chats_biotech_id_idx" ON "chats"("biotech_id");

-- CreateIndex
CREATE INDEX "chats_vendor_company_id_idx" ON "chats"("vendor_company_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_biotech_id_fkey" FOREIGN KEY ("biotech_id") REFERENCES "biotechs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_project_connection_id_fkey" FOREIGN KEY ("project_connection_id") REFERENCES "project_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
