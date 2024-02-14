-- CreateTable
CREATE TABLE "project_decline_feedbacks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reason" TEXT,
    "project_connection_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_decline_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_decline_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_decline_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_decline_tag_connections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_decline_tag_id" UUID NOT NULL,
    "project_decline_feedback_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_decline_tag_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_decline_tags_name_key" ON "project_decline_tags"("name");

-- AddForeignKey
ALTER TABLE "project_decline_feedbacks" ADD CONSTRAINT "project_decline_feedbacks_project_connection_id_fkey" FOREIGN KEY ("project_connection_id") REFERENCES "project_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_decline_tag_connections" ADD CONSTRAINT "project_decline_tag_connections_project_decline_tag_id_fkey" FOREIGN KEY ("project_decline_tag_id") REFERENCES "project_decline_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_decline_tag_connections" ADD CONSTRAINT "project_decline_tag_connections_project_decline_feedback_i_fkey" FOREIGN KEY ("project_decline_feedback_id") REFERENCES "project_decline_feedbacks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
