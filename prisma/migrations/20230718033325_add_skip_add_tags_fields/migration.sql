-- AlterTable
ALTER TABLE "vendor_companies" ADD COLUMN     "skip_certification_tag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "skip_lab_specialization" BOOLEAN NOT NULL DEFAULT false;
