-- CreateTable
CREATE TABLE "sourcing_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_title" TEXT NOT NULL,
    "project_desc" TEXT NOT NULL,
    "preparation_details" TEXT NOT NULL,
    "vendor_requirement" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "task_canceled_at" TIMESTAMP(3),
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sourcing_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sourcing_subspecialties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "sourcing_session_id" UUID NOT NULL,

    CONSTRAINT "sourcing_subspecialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sourcing_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "content_type" TEXT,
    "byte_size" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourcing_session_id" UUID NOT NULL,

    CONSTRAINT "sourcing_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sourced_cros" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "is_shortlisted" BOOLEAN NOT NULL,
    "vendor_company_id" UUID NOT NULL,
    "sourcing_session_id" UUID NOT NULL,

    CONSTRAINT "sourced_cros_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sourcing_attachments_key_key" ON "sourcing_attachments"("key");

-- AddForeignKey
ALTER TABLE "sourcing_subspecialties" ADD CONSTRAINT "sourcing_subspecialties_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sourcing_attachments" ADD CONSTRAINT "sourcing_attachments_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sourced_cros" ADD CONSTRAINT "sourced_cros_vendor_company_id_fkey" FOREIGN KEY ("vendor_company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sourced_cros" ADD CONSTRAINT "sourced_cros_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
