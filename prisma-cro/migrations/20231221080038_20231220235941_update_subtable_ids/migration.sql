/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `founders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `founders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `funding_rounds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `funding_rounds` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `press_references` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `press_references` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[category_id,funding_info_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[founder_id,funding_info_id]` on the table `founders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[round_id,funding_info_id]` on the table `funding_rounds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[press_id,funding_info_id]` on the table `press_references` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `founder_id` to the `founders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `round_id` to the `funding_rounds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `press_id` to the `press_references` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "categories_id_funding_info_id_key";

-- DropIndex
DROP INDEX "founders_id_funding_info_id_key";

-- DropIndex
DROP INDEX "funding_rounds_id_funding_info_id_key";

-- DropIndex
DROP INDEX "press_references_id_funding_info_id_key";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ADD COLUMN     "category_id" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "founders" DROP CONSTRAINT "founders_pkey",
ADD COLUMN     "founder_id" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "founders_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "funding_rounds" DROP CONSTRAINT "funding_rounds_pkey",
ADD COLUMN     "round_id" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "funding_rounds_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "press_references" DROP CONSTRAINT "press_references_pkey",
ADD COLUMN     "press_id" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "press_references_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_id_funding_info_id_key" ON "categories"("category_id", "funding_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "founders_founder_id_funding_info_id_key" ON "founders"("founder_id", "funding_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "funding_rounds_round_id_funding_info_id_key" ON "funding_rounds"("round_id", "funding_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "press_references_press_id_funding_info_id_key" ON "press_references"("press_id", "funding_info_id");
