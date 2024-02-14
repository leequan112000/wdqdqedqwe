-- CreateTable
CREATE TABLE "sourcing_subspecialties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "sourcing_session_id" UUID NOT NULL,
    "sourcing_specialty_id" UUID NOT NULL,

    CONSTRAINT "sourcing_subspecialties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sourcing_subspecialties" ADD CONSTRAINT "sourcing_subspecialties_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sourcing_subspecialties" ADD CONSTRAINT "sourcing_subspecialties_sourcing_specialty_id_fkey" FOREIGN KEY ("sourcing_specialty_id") REFERENCES "sourcing_specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
