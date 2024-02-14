-- CreateTable
CREATE TABLE "oauths" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_id" UUID,

    CONSTRAINT "oauths_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "oauths" ADD CONSTRAINT "oauths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
