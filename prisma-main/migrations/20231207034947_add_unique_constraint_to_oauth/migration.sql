/*
  Warnings:

  - A unique constraint covering the columns `[user_id,provider]` on the table `oauths` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "oauths_user_id_provider_key" ON "oauths"("user_id", "provider");
