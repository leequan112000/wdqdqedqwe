import { PublicError } from '../../graphql/errors/PublicError';
import invariant from '../../helper/invariant';
import reviewService from '../../services/review/review.service';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';

const resolvers: Resolvers<Context> = {
  Mutation: {
    addReviewQuestionSet: async (parent, args, context) => {
      const newQuestionSet = await context.prisma.reviewQuestionSet.create({
        data: {
          name: args.name,
        },
      });

      return newQuestionSet;
    },
    duplicateQuestionSet: async (_, args, context) => {
      const { review_question_set_id, name } = args;
      const reviewQuestionSet = await context.prisma.reviewQuestionSet.findFirst({
        where: {
          id: review_question_set_id,
        },
        include: {
          review_questions: {
            include: {
              review_question_options: true,
            },
          },
        },
      });
      invariant(reviewQuestionSet, new PublicError('Question set not found.'))

      const newReviewQuestionSet = await context.prisma.$transaction(async (trx) => {
        // Recreate question set
        const newReviewQuestionSet = await trx.reviewQuestionSet.create({
          data: {
            name: name ?? reviewQuestionSet.name,
          },
        });

        // Recreate question w/ options
        const promises = reviewQuestionSet.review_questions.map(async (rq) => {
          const options = rq.review_question_options.map((rqo) => ({
            option_text: rqo.option_text
          }));
          return await trx.reviewQuestion.create({
            data: {
              review_question_set_id: newReviewQuestionSet.id,
              question_text: rq.question_text,
              question_type: rq.question_type,
              ordinal: rq.ordinal,
              review_question_options: {
                createMany: {
                  data: options,
                },
              },
            }
          });
        });
        await Promise.all(promises);

        return newReviewQuestionSet;
      })


      return newReviewQuestionSet;
    },
    removeReviewQuestionSet: async (_, args, context) => {
      const { review_question_set_id } = args;
      console.log(review_question_set_id)

      const reviewQuestionSet = await context.prisma.reviewQuestionSet.findFirst({
        where: {
          id: review_question_set_id,
        },
        include: {
          reviews: {
            take: 1,
          },
        },
      });

      invariant(reviewQuestionSet, new PublicError('Review question set not found.'));
      invariant(
        reviewQuestionSet.reviews.length === 0,
        new PublicError('Review question set is answered'),
      );

      await context.prisma.reviewQuestionSet.delete({
        where: {
          id: review_question_set_id,
        },
      });

      return reviewQuestionSet;
    },

    addReviewQuestion: async (_, args, context) => {
      const { question_text, question_type, review_question_set_id } = args;

      const lastReviewQuestionInTheGroup = await context.prisma.reviewQuestion.findFirst({
        where: {
          review_question_set_id,
        },
        orderBy: {
          ordinal: 'desc',
        },
        take: 1,
      });

      const nextOrdinal = lastReviewQuestionInTheGroup?.ordinal !== undefined
        && lastReviewQuestionInTheGroup?.ordinal >= 0
        ? lastReviewQuestionInTheGroup.ordinal + 1
        : undefined;

      const reviewQuestion = await context.prisma.reviewQuestion.create({
        data: {
          question_type,
          question_text,
          review_question_set_id,
          ordinal: nextOrdinal,
        },
      });

      return reviewQuestion;
    },
    updateReviewQuestion: async (_, args, context) => {
      const { question_text, question_type, review_question_id } = args;

      await reviewService.checkIsQuestionAnswered(
        { review_question_id },
        { prisma: context.prisma },
      );

      const updatedReviewQuestion = await context.prisma.reviewQuestion.update({
        data: {
          question_text,
          question_type,
        },
        where: {
          id: review_question_id,
        },
      });

      return updatedReviewQuestion;
    },
    removeReviewQuestion: async (_, args, context) => {
      const { review_question_id } = args;

      const reviewQuestion = await reviewService.checkIsQuestionAnswered(
        { review_question_id },
        { prisma: context.prisma },
      );

      await context.prisma.$transaction([
        context.prisma.reviewQuestionOption.deleteMany({
          where: {
            review_question_id,
          },
        }),
        context.prisma.reviewQuestion.delete({
          where: {
            id: review_question_id,
          },
        }),
      ]);

      return reviewQuestion;
    },
    addReviewQuestionOption: async (_, args, context) => {
      const { option_text, review_question_id } = args;

      const reviewQuestionOption = await context.prisma.reviewQuestionOption.create({
        data: {
          option_text,
          review_question_id,
        },
      });

      return reviewQuestionOption;
    },
    removeReviewQuestionOption: async (_, args, context) => {
      const { review_question_option_id } = args;

      const reviewQuestion = await context.prisma.reviewQuestionOption.delete({
        where: {
          id: review_question_option_id,
        },
      });

      return reviewQuestion;
    },
  }
}

export default resolvers;
