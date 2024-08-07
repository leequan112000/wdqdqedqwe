-- RenameTable
ALTER TABLE "paid_vendors" RENAME TO "vendors";

-- RenameIndex
ALTER INDEX "paid_vendors_user_id_key" RENAME TO "vendors_user_id_key";

-- RenameForeignKey
ALTER TABLE "vendors" RENAME CONSTRAINT "paid_vendors_user_id_fkey" TO "vendors_user_id_fkey";

-- RenamePrimaryKey
ALTER TABLE "vendors" RENAME CONSTRAINT "paid_vendors_pkey" TO "vendors_pkey";
