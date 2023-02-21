-- CreateTable
CREATE TABLE "invitations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sender_type" TEXT NOT NULL,
    "sender_id" UUID NOT NULL,
    "receiver_type" TEXT NOT NULL,
    "receiver_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "invitations_sender_type_sender_id_idx" ON "invitations"("sender_type", "sender_id");

-- CreateIndex
CREATE INDEX "invitations_receiver_type_receiver_id_idx" ON "invitations"("receiver_type", "receiver_id");
