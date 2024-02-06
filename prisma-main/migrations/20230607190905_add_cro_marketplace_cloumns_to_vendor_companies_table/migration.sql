-- AlterTable
ALTER TABLE "vendor_companies" ADD COLUMN     "invited_by" TEXT,
ADD COLUMN     "is_on_marketplace" BOOLEAN DEFAULT true;
