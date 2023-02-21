-- CreateTable
CREATE TABLE "vendor_member_connections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "project_connection_id" UUID NOT NULL,
    "vendor_member_id" UUID NOT NULL,

    CONSTRAINT "vendor_member_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vendor_member_connections_project_connection_id_idx" ON "vendor_member_connections"("project_connection_id");

-- AddForeignKey
ALTER TABLE "vendor_member_connections" ADD CONSTRAINT "vendor_member_connections_project_connection_id_fkey" FOREIGN KEY ("project_connection_id") REFERENCES "project_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_member_connections" ADD CONSTRAINT "vendor_member_connections_vendor_member_id_fkey" FOREIGN KEY ("vendor_member_id") REFERENCES "vendor_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
