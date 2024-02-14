-- CreateTable
CREATE TABLE "project_request_comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "project_request_id" UUID NOT NULL,

    CONSTRAINT "project_request_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_request_comments_project_request_id_idx" ON "project_request_comments"("project_request_id");

-- CreateIndex
CREATE INDEX "project_request_comments_created_at_idx" ON "project_request_comments"("created_at");

-- AddForeignKey
ALTER TABLE "project_request_comments" ADD CONSTRAINT "project_request_comments_project_request_id_fkey" FOREIGN KEY ("project_request_id") REFERENCES "project_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
