-- DropForeignKey
ALTER TABLE "customer_connections" DROP CONSTRAINT "customer_connections_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "vendor_member_connections" DROP CONSTRAINT "vendor_member_connections_vendor_member_id_fkey";

-- AddForeignKey
ALTER TABLE "vendor_member_connections" ADD CONSTRAINT "vendor_member_connections_vendor_member_id_fkey" FOREIGN KEY ("vendor_member_id") REFERENCES "vendor_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_connections" ADD CONSTRAINT "customer_connections_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
