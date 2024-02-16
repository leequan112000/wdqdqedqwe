-- CreateTable
CREATE TABLE "subspecialties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "definition" TEXT,
    "specialty_id" UUID NOT NULL,

    CONSTRAINT "subspecialties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subspecialties" ADD CONSTRAINT "subspecialties_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
