-- CreateTable
CREATE TABLE "paid_vendors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "company_name" TEXT,
    "company_types" TEXT[],
    "company_description" TEXT,
    "company_ipo_status" TEXT,
    "company_revenue" TEXT,
    "company_size" TEXT,
    "logo_url" TEXT,
    "website" TEXT,
    "countries" TEXT[],
    "subspecialty_ids" TEXT[],
    "custom_specialties" TEXT[],
    "certifications" TEXT[],
    "products" TEXT[],
    "email" TEXT,
    "note" TEXT,
    "attachment_key" TEXT,
    "attachment_file_name" TEXT,
    "attachment_content_type" TEXT,
    "edit_counts" INTEGER NOT NULL DEFAULT 0,
    "stripe_subscription_id" TEXT,
    "stripe_customer_id" TEXT,
    "plan_name" TEXT,
    "subscription_status" TEXT,
    "subscription_ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paid_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paid_vendors_user_id_key" ON "paid_vendors"("user_id");

-- AddForeignKey
ALTER TABLE "paid_vendors" ADD CONSTRAINT "paid_vendors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
