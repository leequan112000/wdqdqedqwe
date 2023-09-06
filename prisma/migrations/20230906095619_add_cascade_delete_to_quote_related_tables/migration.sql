-- DropForeignKey
ALTER TABLE "quote_reviews" DROP CONSTRAINT "quote_reviews_review_id_fkey";

-- DropForeignKey
ALTER TABLE "review_answers" DROP CONSTRAINT "review_answers_review_id_fkey";

-- DropForeignKey
ALTER TABLE "review_answers" DROP CONSTRAINT "review_answers_review_question_id_fkey";

-- AddForeignKey
ALTER TABLE "quote_reviews" ADD CONSTRAINT "quote_reviews_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_answers" ADD CONSTRAINT "review_answers_review_question_id_fkey" FOREIGN KEY ("review_question_id") REFERENCES "review_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_answers" ADD CONSTRAINT "review_answers_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
