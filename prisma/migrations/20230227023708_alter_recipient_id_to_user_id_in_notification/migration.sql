/*
  Warnings:

  - You are about to drop the column `recipient_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_type` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "notifications_recipient_type_recipient_id_idx";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "recipient_id",
DROP COLUMN "recipient_type",
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
