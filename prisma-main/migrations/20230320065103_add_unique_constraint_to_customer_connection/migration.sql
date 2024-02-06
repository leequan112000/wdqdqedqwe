/*
  Warnings:

  - A unique constraint covering the columns `[project_connection_id,customer_id]` on the table `customer_connections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customer_connections_project_connection_id_customer_id_key" ON "customer_connections"("project_connection_id", "customer_id");
