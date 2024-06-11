-- DropForeignKey
ALTER TABLE "customer_subscriptions" DROP CONSTRAINT "customer_subscriptions_customer_id_fkey";

-- AddForeignKey
ALTER TABLE "customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
