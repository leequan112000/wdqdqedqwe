-- CreateTable
CREATE TABLE "vendor_company_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_type" TEXT NOT NULL,
    "vendor_company_id" UUID NOT NULL,

    CONSTRAINT "vendor_company_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vendor_company_types" ADD CONSTRAINT "vendor_company_types_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
