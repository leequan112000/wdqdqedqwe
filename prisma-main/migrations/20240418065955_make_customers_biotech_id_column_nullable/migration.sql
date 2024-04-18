-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_biotech_id_fkey";

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "biotech_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_biotech_id_fkey" FOREIGN KEY ("biotech_id") REFERENCES "biotechs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
