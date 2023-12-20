-- AlterTable
ALTER TABLE "milestones" ADD COLUMN "title" TEXT NOT NULL DEFAULT 'Title';
ALTER TABLE "milestones" ALTER COLUMN "title" DROP DEFAULT;

