-- CreateTable
CREATE TABLE "meeting_guests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "meeting_event_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meeting_guests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meeting_guests_email_meeting_event_id_key" ON "meeting_guests"("email", "meeting_event_id");

-- AddForeignKey
ALTER TABLE "meeting_guests" ADD CONSTRAINT "meeting_guests_meeting_event_id_fkey" FOREIGN KEY ("meeting_event_id") REFERENCES "meeting_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
