-- DropForeignKey
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_user_id_fkey";

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
