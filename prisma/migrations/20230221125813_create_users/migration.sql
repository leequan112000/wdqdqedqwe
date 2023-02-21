/*
  Warnings:

  - You are about to drop the column `email` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `vendor_members` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `vendor_members` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `vendor_members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `vendor_members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `vendor_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "customers_email_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "email",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "vendor_members" DROP COLUMN "email",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "encrypted_password" TEXT NOT NULL,
    "reset_password_token" TEXT,
    "reset_password_sent_at" TIMESTAMP(3),
    "remember_created_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_password_token_key" ON "users"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_members_user_id_key" ON "vendor_members"("user_id");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_members" ADD CONSTRAINT "vendor_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
