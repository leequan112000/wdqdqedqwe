/*
  Warnings:

  - You are about to drop the column `reference_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `reference_type` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `params` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_sender_id_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "reference_id",
DROP COLUMN "reference_type",
ADD COLUMN     "params" JSONB NOT NULL,
ALTER COLUMN "sender_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
