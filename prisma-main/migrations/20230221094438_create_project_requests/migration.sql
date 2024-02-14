-- CreateTable
CREATE TABLE "project_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "creator_email" TEXT,
    "creator_name" TEXT,
    "creator_job" TEXT,
    "creator_company" TEXT,
    "title" TEXT NOT NULL,
    "vendor_requirement" TEXT NOT NULL,
    "objective_description" TEXT NOT NULL,
    "preparation_description" TEXT,
    "in_contact_with_vendor" BOOLEAN NOT NULL,
    "existing_vendor_contact_description" TEXT,
    "project_challenge_description" TEXT,
    "vendor_search_timeframe" TEXT NOT NULL,
    "max_budget" DECIMAL(14,2) NOT NULL,
    "vendor_location_requirement" TEXT,
    "project_start_time_requirement" TEXT,
    "project_deadline_requirement" TEXT,
    "state" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "biotech_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "vendor_company_id" UUID NOT NULL,
    "vendor_member_id" UUID NOT NULL,

    CONSTRAINT "project_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_requests_biotech_id_idx" ON "project_requests"("biotech_id");

-- CreateIndex
CREATE INDEX "project_requests_customer_id_idx" ON "project_requests"("customer_id");

-- CreateIndex
CREATE INDEX "project_requests_vendor_company_id_idx" ON "project_requests"("vendor_company_id");

-- CreateIndex
CREATE INDEX "project_requests_vendor_member_id_idx" ON "project_requests"("vendor_member_id");

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_biotech_id_fkey" FOREIGN KEY ("biotech_id") REFERENCES "biotechs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_vendor_member_id_fkey" FOREIGN KEY ("vendor_member_id") REFERENCES "vendor_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
