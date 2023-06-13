-- AlterTable
ALTER TABLE "vendor_companies" ADD COLUMN     "cro_details" TEXT,
ADD COLUMN     "facebook_url" TEXT,
ADD COLUMN     "founded_year" INTEGER,
ADD COLUMN     "linkedin_url" TEXT,
ADD COLUMN     "team_size" TEXT,
ADD COLUMN     "twitter_url" TEXT;

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
CREATE TABLE "certification_tag_connections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vendor_company_id" UUID NOT NULL,
    "certification_tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certification_tag_connections_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "lab_specialization_connections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vendor_company_id" UUID NOT NULL,
    "lab_specialization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_specialization_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certification_tags_full_name_key" ON "certification_tags"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "certification_tag_connections_vendor_company_id_certificati_key" ON "certification_tag_connections"("vendor_company_id", "certification_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "lab_specializations_full_name_key" ON "lab_specializations"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "lab_specialization_connections_vendor_company_id_lab_specia_key" ON "lab_specialization_connections"("vendor_company_id", "lab_specialization_id");

-- AddForeignKey
ALTER TABLE "certification_tag_connections" ADD CONSTRAINT "certification_tag_connections_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_tag_connections" ADD CONSTRAINT "certification_tag_connections_certification_tag_id_fkey" FOREIGN KEY ("certification_tag_id") REFERENCES "certification_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_specialization_connections" ADD CONSTRAINT "lab_specialization_connections_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_specialization_connections" ADD CONSTRAINT "lab_specialization_connections_lab_specialization_id_fkey" FOREIGN KEY ("lab_specialization_id") REFERENCES "lab_specializations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
