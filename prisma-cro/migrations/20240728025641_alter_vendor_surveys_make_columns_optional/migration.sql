-- AlterTable
ALTER TABLE "vendor_surveys" ALTER COLUMN "company_name" DROP NOT NULL,
ALTER COLUMN "logo_url" DROP NOT NULL,
ALTER COLUMN "website" DROP NOT NULL,
ALTER COLUMN "company_description" DROP NOT NULL,
ALTER COLUMN "company_ipo_status" DROP NOT NULL,
ALTER COLUMN "company_revenue" DROP NOT NULL,
ALTER COLUMN "company_size" DROP NOT NULL;
