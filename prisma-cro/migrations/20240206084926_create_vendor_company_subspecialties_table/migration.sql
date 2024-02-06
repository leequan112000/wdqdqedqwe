-- CreateTable
CREATE TABLE "vendor_company_subspecialties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subspecialty_id" UUID NOT NULL,
    "vendor_company_id" UUID NOT NULL,

    CONSTRAINT "vendor_company_subspecialties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vendor_company_subspecialties" ADD CONSTRAINT "vendor_company_subspecialties_subspecialty_id_fkey" FOREIGN KEY ("subspecialty_id") REFERENCES "subspecialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_company_subspecialties" ADD CONSTRAINT "vendor_company_subspecialties_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
