-- AddColumn
ALTER TABLE "sourcing_sessions" ADD COLUMN "user_id" UUID;

-- Update existing records with owner's biotech_id
UPDATE "sourcing_sessions" ss SET "user_id" = (
  SELECT c.user_id
  FROM "customers" c
  WHERE c.role = 'owner' AND c.biotech_id = ss.biotech_id
);

-- AddForeignKey
ALTER TABLE "sourcing_sessions" ADD CONSTRAINT "sourcing_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "sourcing_sessions" DROP CONSTRAINT "sourcing_sessions_biotech_id_fkey";

-- AlterTable
ALTER TABLE "sourcing_sessions" DROP COLUMN "biotech_id";
