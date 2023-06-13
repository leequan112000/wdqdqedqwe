-- AlterTable
ALTER TABLE "vendor_companies" ADD COLUMN     "founded_year" INTEGER,
ADD COLUMN     "team_size" TEXT;

-- CreateTable
CREATE TABLE "certification_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "priority" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certification_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_tags_on_vendor_companies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vendor_company_id" UUID NOT NULL,
    "certification_tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certification_tags_on_vendor_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_specializations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "priority" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_specializations_on_vendor_companies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vendor_company_id" UUID NOT NULL,
    "lab_specialization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_specializations_on_vendor_companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certification_tags_full_name_key" ON "certification_tags"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "certification_tags_on_vendor_companies_vendor_company_id_ce_key" ON "certification_tags_on_vendor_companies"("vendor_company_id", "certification_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "lab_specializations_full_name_key" ON "lab_specializations"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "lab_specializations_on_vendor_companies_vendor_company_id_l_key" ON "lab_specializations_on_vendor_companies"("vendor_company_id", "lab_specialization_id");

-- AddForeignKey
ALTER TABLE "certification_tags_on_vendor_companies" ADD CONSTRAINT "certification_tags_on_vendor_companies_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_tags_on_vendor_companies" ADD CONSTRAINT "certification_tags_on_vendor_companies_certification_tag_i_fkey" FOREIGN KEY ("certification_tag_id") REFERENCES "certification_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_specializations_on_vendor_companies" ADD CONSTRAINT "lab_specializations_on_vendor_companies_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_specializations_on_vendor_companies" ADD CONSTRAINT "lab_specializations_on_vendor_companies_lab_specialization_fkey" FOREIGN KEY ("lab_specialization_id") REFERENCES "lab_specializations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
