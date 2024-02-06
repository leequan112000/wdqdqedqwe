-- CreateTable
CREATE TABLE "project_connections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vendor_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "final_contract_uploaded_at" TIMESTAMP(3) NOT NULL,
    "project_request_id" UUID NOT NULL,
    "vendor_company_id" UUID NOT NULL,

    CONSTRAINT "project_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_connections_project_request_id_idx" ON "project_connections"("project_request_id");

-- CreateIndex
CREATE INDEX "project_connections_vendor_company_id_idx" ON "project_connections"("vendor_company_id");

-- AddForeignKey
ALTER TABLE "project_connections" ADD CONSTRAINT "project_connections_project_request_id_fkey" FOREIGN KEY ("project_request_id") REFERENCES "project_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_connections" ADD CONSTRAINT "project_connections_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
