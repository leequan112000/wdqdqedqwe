-- CreateTable
CREATE TABLE "vendor_companies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_name" TEXT NOT NULL,
    "website_url" TEXT NOT NULL,
    "linkedin_url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "is_cromatic_vendor" BOOLEAN NOT NULL,

    CONSTRAINT "vendor_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traffic_info" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "display_date" TIMESTAMP(3) NOT NULL,
    "rank" INTEGER NOT NULL,
    "visits" INTEGER NOT NULL,
    "users" INTEGER NOT NULL,
    "search_organic" INTEGER NOT NULL,
    "search_paid" INTEGER NOT NULL,
    "social_organic" INTEGER NOT NULL,
    "social_paid" INTEGER NOT NULL,
    "referral" INTEGER NOT NULL,
    "time_on_site" INTEGER NOT NULL,
    "pages_per_visit" DOUBLE PRECISION NOT NULL,
    "bounce_rate" DOUBLE PRECISION NOT NULL,
    "categories" TEXT NOT NULL,

    CONSTRAINT "traffic_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linkedin_info" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_size" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "linkedin_followers" INTEGER NOT NULL,
    "founded" INTEGER NOT NULL,
    "headquarters_city" TEXT NOT NULL,
    "headquarters_country" TEXT NOT NULL,
    "headquarters_state" TEXT NOT NULL,
    "headquarters_street1" TEXT NOT NULL,
    "headquarters_street2" TEXT NOT NULL,
    "headquarters_zip" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "li_last_updated" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "employees_count" INTEGER NOT NULL,

    CONSTRAINT "linkedin_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_specialties" (
    "id" TEXT NOT NULL,
    "linkedin_info_id" UUID NOT NULL,
    "specialty" TEXT NOT NULL,

    CONSTRAINT "company_specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "featured_employees" (
    "id" TEXT NOT NULL,
    "linkedin_info_id" UUID NOT NULL,
    "linkedin_url" TEXT NOT NULL,

    CONSTRAINT "featured_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funding_info" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_type" TEXT NOT NULL,
    "ipo_status" TEXT NOT NULL,
    "revenue_range" TEXT NOT NULL,
    "org_rank" INTEGER NOT NULL,
    "num_articles" INTEGER NOT NULL,

    CONSTRAINT "funding_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "funding_info_id" UUID NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "press_references" (
    "id" TEXT NOT NULL,
    "funding_info_id" UUID NOT NULL,
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "posted_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "press_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funding_rounds" (
    "id" TEXT NOT NULL,
    "funding_info_id" UUID NOT NULL,
    "is_equity" BOOLEAN NOT NULL,
    "investment_stage" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "money_raised" INTEGER NOT NULL,
    "announced_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funding_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "founders" (
    "id" TEXT NOT NULL,
    "funding_info_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "primary_job_title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "linkedin" TEXT NOT NULL,
    "num_founded_organizations" INTEGER NOT NULL,
    "rank_person" INTEGER NOT NULL,

    CONSTRAINT "founders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_info" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "traffic_info" ADD CONSTRAINT "traffic_info_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linkedin_info" ADD CONSTRAINT "linkedin_info_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_specialties" ADD CONSTRAINT "company_specialties_linkedin_info_id_fkey" FOREIGN KEY ("linkedin_info_id") REFERENCES "linkedin_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "featured_employees" ADD CONSTRAINT "featured_employees_linkedin_info_id_fkey" FOREIGN KEY ("linkedin_info_id") REFERENCES "linkedin_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funding_info" ADD CONSTRAINT "funding_info_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_funding_info_id_fkey" FOREIGN KEY ("funding_info_id") REFERENCES "funding_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "press_references" ADD CONSTRAINT "press_references_funding_info_id_fkey" FOREIGN KEY ("funding_info_id") REFERENCES "funding_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funding_rounds" ADD CONSTRAINT "funding_rounds_funding_info_id_fkey" FOREIGN KEY ("funding_info_id") REFERENCES "funding_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "founders" ADD CONSTRAINT "founders_funding_info_id_fkey" FOREIGN KEY ("funding_info_id") REFERENCES "funding_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_info" ADD CONSTRAINT "website_info_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "vendor_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
