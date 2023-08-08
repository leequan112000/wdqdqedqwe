-- CreateTable
CREATE TABLE "biotech_invite_vendors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "biotech_id" UUID,
    "inviter_id" UUID,

    CONSTRAINT "biotech_invite_vendors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "biotech_invite_vendors" ADD CONSTRAINT "biotech_invite_vendors_biotech_id_fkey" FOREIGN KEY ("biotech_id") REFERENCES "biotechs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biotech_invite_vendors" ADD CONSTRAINT "biotech_invite_vendors_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
