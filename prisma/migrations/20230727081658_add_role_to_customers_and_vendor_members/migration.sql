-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "vendor_members" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
