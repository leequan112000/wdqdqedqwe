import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';
import reviewService from '../../services/review/review.service';
import { Context } from '../../types/context';

const resolvers: Resolvers<Context> = {
  Review: {
    review_questions: async (parent, _, context) => {
      if (parent.review_questions) return parent.review_questions;

      invariant(parent.review_question_set_id, 'Review question set id not found.');

      const reviewQuestions = await context.prisma.reviewQuestion.findMany({
        where: {
          review_question_set_id: parent.review_question_set_id,
        },
        orderBy: [
          {
            ordinal: 'asc',
          },
          {
            created_at: 'asc',
          },
        ],
      });

      return reviewQuestions;
    },
    review_answers: async (parent, _, context) => {
      if (parent.review_answers) return parent.review_answers;

      invariant(parent.id, 'Review id not found.');

      const reviewAnswers = await context.prisma.reviewAnswer.findMany({
        where: {
          review_id: parent.id,
        },
      });

      return reviewAnswers;
    },
  },
  ReviewQuestion: {
    review_question_options: async (parent, _, context) => {
      const { id, review_question_options } = parent;
      if (review_question_options) return review_question_options;

      invariant(id, 'Question id not found.');

      const reviewQuestionOptions = await context.prisma.reviewQuestionOption.findMany({
        where: {
          review_question_id: id,
        },
        orderBy: [
          {
            ordinal: 'asc',
          },
          {
            created_at: 'asc',
          },
        ],
      });

      return reviewQuestionOptions;
    }
  },
  Query: {
    /**
     * Usage: To view quote review question.
     * Return the question that answered previoudly if review record exists.
     */
    quoteReviewQuestions: async (_, args, context) => {
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id is missing.');

      const reviewQuestions = reviewService.getQuoteReviewQuestions(
        {
          current_user_id: currentUserId,
          quote_id: args.quote_id,
        },
        { prisma: context.prisma },
      );

      return reviewQuestions;
    },
  },
  Mutation: {
    draftQuoteReview: async (_, args, context) => {
      const { input, quote_id, is_final_step } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');

      const reviewInput = input ?? [];

      return await context.prisma.$transaction(async (trx) => {
        return reviewService.draftQuoteReview(
          {
            current_user_id: currentUserId,
            quote_id,
            review_input: reviewInput,
            is_final: is_final_step ?? undefined,
          },
          {
            prisma: trx,
          }
        )
      })
    },
  },
}

export default resolvers;
