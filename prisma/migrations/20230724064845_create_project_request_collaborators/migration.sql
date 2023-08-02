-- CreateTable
CREATE TABLE "project_request_collaborators" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "project_request_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,

    CONSTRAINT "project_request_collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_request_collaborators_project_request_id_idx" ON "project_request_collaborators"("project_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_request_collaborators_project_request_id_customer_i_key" ON "project_request_collaborators"("project_request_id", "customer_id");

-- AddForeignKey
ALTER TABLE "project_request_collaborators" ADD CONSTRAINT "project_request_collaborators_project_request_id_fkey" FOREIGN KEY ("project_request_id") REFERENCES "project_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_request_collaborators" ADD CONSTRAINT "project_request_collaborators_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
