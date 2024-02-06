/*
  Warnings:

  - You are about to drop the column `params` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `message` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refernece_type` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropIndex
DROP INDEX "notifications_user_id_idx";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "params",
DROP COLUMN "user_id",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "recipient_id" UUID NOT NULL,
ADD COLUMN     "reference_id" UUID NOT NULL,
ADD COLUMN     "refernece_type" TEXT NOT NULL,
ADD COLUMN     "sender_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "notifications_sender_id_idx" ON "notifications"("sender_id");

-- CreateIndex
CREATE INDEX "notifications_recipient_id_idx" ON "notifications"("recipient_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
