/*
  Warnings:

  - A unique constraint covering the columns `[id,funding_info_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,funding_info_id]` on the table `founders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,funding_info_id]` on the table `funding_rounds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,funding_info_id]` on the table `press_references` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "categories_id_funding_info_id_key" ON "categories"("id", "funding_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "founders_id_funding_info_id_key" ON "founders"("id", "funding_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "funding_rounds_id_funding_info_id_key" ON "funding_rounds"("id", "funding_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "press_references_id_funding_info_id_key" ON "press_references"("id", "funding_info_id");
