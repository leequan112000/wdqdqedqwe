-- CreateTable
CREATE TABLE "sourcing_extracted_rfps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_title" TEXT NOT NULL,
    "project_desc" TEXT NOT NULL,
    "preparation_details" TEXT NOT NULL,
    "vendor_requirement" TEXT NOT NULL,
    "sourcing_session_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sourcing_extracted_rfps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sourcing_extracted_rfps_sourcing_session_id_key" ON "sourcing_extracted_rfps"("sourcing_session_id");

-- AddForeignKey
ALTER TABLE "sourcing_extracted_rfps" ADD CONSTRAINT "sourcing_extracted_rfps_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
