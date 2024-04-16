-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "vendor_members" DROP CONSTRAINT "vendor_members_user_id_fkey";

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_members" ADD CONSTRAINT "vendor_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
