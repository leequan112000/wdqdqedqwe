-- CreateTable
CREATE TABLE "sourcing_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "content_type" TEXT,
    "byte_size" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourcing_session_id" UUID NOT NULL,
    "uploader_id" UUID NOT NULL,

    CONSTRAINT "sourcing_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sourcing_attachments_key_key" ON "sourcing_attachments"("key");

-- AddForeignKey
ALTER TABLE "sourcing_attachments" ADD CONSTRAINT "sourcing_attachments_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sourcing_attachments" ADD CONSTRAINT "sourcing_attachments_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
