-- CreateTable
CREATE TABLE "sourcing_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_title" TEXT NOT NULL,
    "project_desc" TEXT NOT NULL,
    "preparation_details" TEXT NOT NULL,
    "vendor_requirement" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,

    CONSTRAINT "sourcing_sessions_pkey" PRIMARY KEY ("id")
);
