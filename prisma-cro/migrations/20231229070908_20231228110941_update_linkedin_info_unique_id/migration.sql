/*
  Warnings:

  - The primary key for the `company_specialties` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `company_specialties` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `featured_employees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `featured_employees` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `locations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "company_specialties" DROP CONSTRAINT "company_specialties_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "company_specialties_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "featured_employees" DROP CONSTRAINT "featured_employees_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "featured_employees_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "locations" DROP CONSTRAINT "locations_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");
