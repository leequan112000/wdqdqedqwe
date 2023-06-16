-- AlterTable
ALTER TABLE "milestones" ADD COLUMN "short_id" TEXT NULL;
UPDATE "milestones" SET "short_id" = "id";
ALTER TABLE "milestones" ALTER COLUMN "short_id" SET NOT NULL;


-- AlterTable
ALTER TABLE "quotes" ADD COLUMN "short_id" TEXT NULL;
UPDATE "quotes" SET "short_id" = "id";
ALTER TABLE "quotes" ALTER COLUMN "short_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "milestones_short_id_key" ON "milestones"("short_id");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_short_id_key" ON "quotes"("short_id");
