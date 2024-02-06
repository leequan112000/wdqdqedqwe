/*
  Warnings:

  - Added the required column `document_type` to the `project_attachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project_attachments" ADD COLUMN     "document_type" TEXT NOT NULL;
