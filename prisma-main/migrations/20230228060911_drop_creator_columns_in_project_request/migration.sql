/*
  Warnings:

  - You are about to drop the column `creator_company` on the `project_requests` table. All the data in the column will be lost.
  - You are about to drop the column `creator_email` on the `project_requests` table. All the data in the column will be lost.
  - You are about to drop the column `creator_job` on the `project_requests` table. All the data in the column will be lost.
  - You are about to drop the column `creator_name` on the `project_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project_requests" DROP COLUMN "creator_company",
DROP COLUMN "creator_email",
DROP COLUMN "creator_job",
DROP COLUMN "creator_name";
