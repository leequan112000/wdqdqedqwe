-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "is_draft" BOOLEAN NOT NULL,
    "review_question_set_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "review_id" UUID NOT NULL,
    "quote_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "review_question_set_id" UUID NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_question_options" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "review_question_id" UUID NOT NULL,
    "option_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_answers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "review_question_id" UUID NOT NULL,
    "review_id" UUID NOT NULL,
    "answer_text" TEXT,
    "rating_value" INTEGER,
    "option_value" TEXT,

    CONSTRAINT "review_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_question_sets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_question_sets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_review_question_set_id_key" ON "reviews"("user_id", "review_question_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "quote_reviews_review_id_key" ON "quote_reviews"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_answers_review_id_review_question_id_key" ON "review_answers"("review_id", "review_question_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_review_question_set_id_fkey" FOREIGN KEY ("review_question_set_id") REFERENCES "review_question_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_reviews" ADD CONSTRAINT "quote_reviews_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_reviews" ADD CONSTRAINT "quote_reviews_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_questions" ADD CONSTRAINT "review_questions_review_question_set_id_fkey" FOREIGN KEY ("review_question_set_id") REFERENCES "review_question_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_question_options" ADD CONSTRAINT "review_question_options_review_question_id_fkey" FOREIGN KEY ("review_question_id") REFERENCES "review_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_answers" ADD CONSTRAINT "review_answers_review_question_id_fkey" FOREIGN KEY ("review_question_id") REFERENCES "review_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_answers" ADD CONSTRAINT "review_answers_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
