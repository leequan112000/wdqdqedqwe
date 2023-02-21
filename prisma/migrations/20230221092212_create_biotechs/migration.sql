/*
  Warnings:

  - Added the required column `biotech_id` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "biotech_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "biotechs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "has_setup_profile" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT,
    "website" TEXT,
    "about" TEXT,
    "cda_pandadoc_file_id" TEXT,
    "cda_pandadoc_view_session_id" TEXT,
    "cda_pandadoc_view_session_expires_at" TIMESTAMP(3),
    "cda_signed_at" TIMESTAMP(3),
    "number_of_reqs_allowed_without_subscription" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "biotechs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "biotechs_name_key" ON "biotechs"("name");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_biotech_id_fkey" FOREIGN KEY ("biotech_id") REFERENCES "biotechs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
