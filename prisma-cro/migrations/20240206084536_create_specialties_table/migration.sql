-- CreateTable
CREATE TABLE "specialties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "definition" TEXT,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);
