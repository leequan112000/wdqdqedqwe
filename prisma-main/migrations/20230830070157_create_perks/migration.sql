-- CreateTable
CREATE TABLE "perks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reward_description" TEXT NOT NULL,
    "how_to_redeem" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "external_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "perk_category_id" UUID NOT NULL,
    "expired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "perks" ADD CONSTRAINT "perks_perk_category_id_fkey" FOREIGN KEY ("perk_category_id") REFERENCES "perk_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
