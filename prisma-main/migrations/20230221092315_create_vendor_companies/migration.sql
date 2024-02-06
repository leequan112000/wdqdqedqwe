-- CreateTable
CREATE TABLE "vendor_companies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "address" TEXT,
    "cda_pandadoc_view_session_id" TEXT,
    "cda_pandadoc_view_session_expires_at" TIMESTAMP(3),
    "cda_pandadoc_file_id" TEXT,
    "cda_signed_at" TIMESTAMP(3),

    CONSTRAINT "vendor_companies_pkey" PRIMARY KEY ("id")
);
