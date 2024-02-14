-- CreateTable
CREATE TABLE "sourcing_specialties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "sourcing_session_id" UUID NOT NULL,

    CONSTRAINT "sourcing_specialties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sourcing_specialties" ADD CONSTRAINT "sourcing_specialties_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
