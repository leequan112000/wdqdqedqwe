/*
  Warnings:

  - Changed the type of `document_type` on the `project_attachments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "project_attachments" DROP COLUMN "document_type",
ADD COLUMN     "document_type" INTEGER NOT NULL;
