/*
  Warnings:

  - A unique constraint covering the columns `[project_connection_id,vendor_member_id]` on the table `vendor_member_connections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vendor_member_connections_project_connection_id_vendor_memb_key" ON "vendor_member_connections"("project_connection_id", "vendor_member_id");
