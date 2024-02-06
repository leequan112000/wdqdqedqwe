/*
  Warnings:

  - You are about to drop the column `state` on the `project_requests` table. All the data in the column will be lost.
  - Added the required column `status` to the `project_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project_requests" DROP COLUMN "state",
ADD COLUMN     "status" TEXT NOT NULL;
