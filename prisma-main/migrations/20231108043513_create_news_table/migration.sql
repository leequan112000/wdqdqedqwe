-- CreateTable
CREATE TABLE "news" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "excerpt" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "ghost_slug" TEXT,
    "external_link" TEXT,
    "logo_url" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);
