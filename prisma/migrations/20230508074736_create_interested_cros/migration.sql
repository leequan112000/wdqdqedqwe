-- CreateTable
CREATE TABLE "interested_cros" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company_type" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "interest" TEXT NOT NULL,

    CONSTRAINT "interested_cros_pkey" PRIMARY KEY ("id")
);
