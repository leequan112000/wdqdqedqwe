-- CreateTable
CREATE TABLE "vendor_surveys" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vendor_company_id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_types" TEXT[],
    "logo_url" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "countries" TEXT[],
    "subspecialty_ids" TEXT[],
    "custom_specialties" TEXT[],
    "certifications" TEXT[],
    "product" TEXT,
    "note" TEXT,
    "attachment_key" TEXT,
    "attachment_file_name" TEXT,
    "attachment_content_type" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendor_surveys_vendor_company_id_key" ON "vendor_surveys"("vendor_company_id");

-- AddForeignKey
ALTER TABLE "vendor_surveys" ADD CONSTRAINT "vendor_surveys_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
