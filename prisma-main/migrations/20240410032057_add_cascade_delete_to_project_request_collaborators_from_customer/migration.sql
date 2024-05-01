-- DropForeignKey
ALTER TABLE "project_request_collaborators" DROP CONSTRAINT "project_request_collaborators_customer_id_fkey";

-- AddForeignKey
ALTER TABLE "project_request_collaborators" ADD CONSTRAINT "project_request_collaborators_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
