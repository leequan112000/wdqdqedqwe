-- DropForeignKey
ALTER TABLE "review_question_options" DROP CONSTRAINT "review_question_options_review_question_id_fkey";

-- DropForeignKey
ALTER TABLE "review_questions" DROP CONSTRAINT "review_questions_review_question_set_id_fkey";

-- AddForeignKey
ALTER TABLE "review_questions" ADD CONSTRAINT "review_questions_review_question_set_id_fkey" FOREIGN KEY ("review_question_set_id") REFERENCES "review_question_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_question_options" ADD CONSTRAINT "review_question_options_review_question_id_fkey" FOREIGN KEY ("review_question_id") REFERENCES "review_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
