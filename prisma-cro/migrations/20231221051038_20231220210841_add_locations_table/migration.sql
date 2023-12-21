/*
  Warnings:

  - You are about to drop the column `headquarters_city` on the `linkedin_info` table. All the data in the column will be lost.
  - You are about to drop the column `headquarters_country` on the `linkedin_info` table. All the data in the column will be lost.
  - You are about to drop the column `headquarters_state` on the `linkedin_info` table. All the data in the column will be lost.
  - You are about to drop the column `headquarters_street1` on the `linkedin_info` table. All the data in the column will be lost.
  - You are about to drop the column `headquarters_street2` on the `linkedin_info` table. All the data in the column will be lost.
  - You are about to drop the column `headquarters_zip` on the `linkedin_info` table. All the data in the column will be lost.
  - Added the required column `company_img_url` to the `funding_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "funding_info" ADD COLUMN     "company_img_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "linkedin_info" DROP COLUMN "headquarters_city",
DROP COLUMN "headquarters_country",
DROP COLUMN "headquarters_state",
DROP COLUMN "headquarters_street1",
DROP COLUMN "headquarters_street2",
DROP COLUMN "headquarters_zip";

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "linkedin_info_id" UUID NOT NULL,
    "location_address" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_linkedin_info_id_fkey" FOREIGN KEY ("linkedin_info_id") REFERENCES "linkedin_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
