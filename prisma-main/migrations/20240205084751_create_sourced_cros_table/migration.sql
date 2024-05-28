-- CreateTable
CREATE TABLE "sourced_cros" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "is_shortlisted" BOOLEAN NOT NULL,
    "cro_db_id" UUID NOT NULL,
    "sourcing_session_id" UUID NOT NULL,

    CONSTRAINT "sourced_cros_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sourced_cros" ADD CONSTRAINT "sourced_cros_sourcing_session_id_fkey" FOREIGN KEY ("sourcing_session_id") REFERENCES "sourcing_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
