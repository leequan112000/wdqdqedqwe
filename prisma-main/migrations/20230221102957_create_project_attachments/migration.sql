-- CreateTable
CREATE TABLE "project_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "content_type" TEXT,
    "byte_size" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_connection_id" UUID NOT NULL,

    CONSTRAINT "project_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_attachments_key_key" ON "project_attachments"("key");

-- AddForeignKey
ALTER TABLE "project_attachments" ADD CONSTRAINT "project_attachments_project_connection_id_fkey" FOREIGN KEY ("project_connection_id") REFERENCES "project_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
