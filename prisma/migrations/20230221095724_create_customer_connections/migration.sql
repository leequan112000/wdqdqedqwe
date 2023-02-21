-- CreateTable
CREATE TABLE "customer_connections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "project_connection_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,

    CONSTRAINT "customer_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customer_connections_project_connection_id_idx" ON "customer_connections"("project_connection_id");

-- CreateIndex
CREATE INDEX "customers_biotech_id_idx" ON "customers"("biotech_id");

-- AddForeignKey
ALTER TABLE "customer_connections" ADD CONSTRAINT "customer_connections_project_connection_id_fkey" FOREIGN KEY ("project_connection_id") REFERENCES "project_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_connections" ADD CONSTRAINT "customer_connections_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
