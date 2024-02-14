/*
  Warnings:

  - You are about to drop the column `ghost_slug` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `news` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "news" DROP COLUMN "ghost_slug",
DROP COLUMN "type";
