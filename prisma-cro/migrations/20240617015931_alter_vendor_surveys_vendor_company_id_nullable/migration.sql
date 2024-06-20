-- DropForeignKey
ALTER TABLE "vendor_surveys" DROP CONSTRAINT "vendor_surveys_vendor_company_id_fkey";

-- AlterTable
ALTER TABLE "vendor_surveys" ALTER COLUMN "vendor_company_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "vendor_surveys" ADD CONSTRAINT "vendor_surveys_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
