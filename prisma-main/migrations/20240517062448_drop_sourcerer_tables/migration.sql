/*
  Warnings:

  - You are about to drop the `sourced_cros` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sourcing_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sourcing_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sourcing_subspecialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sourced_cros" DROP CONSTRAINT "sourced_cros_sourcing_session_id_fkey";

-- DropForeignKey
ALTER TABLE "sourcing_attachments" DROP CONSTRAINT "sourcing_attachments_sourcing_session_id_fkey";

-- DropForeignKey
ALTER TABLE "sourcing_attachments" DROP CONSTRAINT "sourcing_attachments_uploader_id_fkey";

-- DropForeignKey
ALTER TABLE "sourcing_sessions" DROP CONSTRAINT "sourcing_sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sourcing_subspecialties" DROP CONSTRAINT "sourcing_subspecialties_sourcing_session_id_fkey";

-- DropTable
DROP TABLE "sourced_cros";

-- DropTable
DROP TABLE "sourcing_attachments";

-- DropTable
DROP TABLE "sourcing_sessions";

-- DropTable
DROP TABLE "sourcing_subspecialties";
