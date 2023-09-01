import { sortBy } from 'lodash';
import { PublicError } from '../../graphql/errors/PublicError';
import invariant from '../../helper/invariant';
import reviewService from '../../services/review/review.service';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import { OrdinalAction } from '../../helper/constant';

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
              group_title: rq.group_title,
              is_required: rq.is_required,
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

      const reviewQuestionSet = await reviewService.checkIsQuestionSetAnswered(
        {
          review_question_set_id,
        },
        {
          prisma: context.prisma,
        },
      );

      await context.prisma.reviewQuestionSet.delete({
        where: {
          id: review_question_set_id,
        },
      });

      return reviewQuestionSet;
    },
    updateReviewQuestionSet: async (_, args, context) => {
      const { name, review_question_set_id } = args;

      const updatedReviewQuestionSet = await context.prisma.reviewQuestionSet.update({
        where: {
          id: review_question_set_id,
        },
        data: {
          name,
        },
      });

      return updatedReviewQuestionSet;
    },

    addReviewQuestion: async (_, args, context) => {
      const {
        question_text, question_type, review_question_set_id,
        group_title, is_required, ordinal, ordinal_action,
      } = args;

      await reviewService.checkIsQuestionSetAnswered(
        {
          review_question_set_id,
        },
        {
          prisma: context.prisma,
        },
      );

      const reviewQuestion = await context.prisma.$transaction(async (trx) => {
        await reviewService.shiftQuestions({
          ordinal,
          ordinal_action: ordinal_action as OrdinalAction,
          review_question_set_id,
        }, {
          prisma: trx,
        });

        const nextOrdinal = ordinal_action === OrdinalAction.AFTER
          ? ordinal + 1
          : ordinal_action === OrdinalAction.BEFORE
            ? ordinal - 1
            : ordinal;

        const reviewQuestion = await trx.reviewQuestion.create({
          data: {
            group_title,
            question_type,
            question_text,
            review_question_set_id,
            ordinal: nextOrdinal,
            is_required: is_required ?? false,
          },
        });

        return reviewQuestion;
      });

      return reviewQuestion;
    },
    updateReviewQuestion: async (_, args, context) => {
      const {
        question_text, question_type, review_question_id,
        group_title, is_required, ordinal, ordinal_action,
      } = args;

      const existingReviewQuestion = await reviewService.checkIsQuestionAnswered(
        { review_question_id },
        { prisma: context.prisma },
      );

      const isOrdinalChanges = existingReviewQuestion.ordinal !== ordinal;

      const updatedReviewQuestion = await context.prisma.$transaction(async (trx) => {
        if (isOrdinalChanges) {
          await reviewService.shiftQuestions({
            ordinal,
            ordinal_action: ordinal_action as OrdinalAction,
            review_question_set_id: existingReviewQuestion.review_question_set_id,
          }, {
            prisma: trx,
          });
        }

        const nextOrdinal = ordinal_action === OrdinalAction.AFTER
          ? ordinal + 1
          : ordinal_action === OrdinalAction.BEFORE
            ? ordinal - 1
            : ordinal;

        const updatedReviewQuestion = await context.prisma.reviewQuestion.update({
          data: {
            group_title,
            question_text,
            question_type,
            is_required: is_required ?? undefined,
            ordinal: nextOrdinal,
          },
          where: {
            id: review_question_id,
          },
        });

        return updatedReviewQuestion;
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

      const lastOption = await context.prisma.reviewQuestionOption.findFirst({
        where: {
          review_question_id,
        },
        orderBy: {
          ordinal: 'desc',
        },
        take: 1,
      });

      const nextOrdinal = lastOption && lastOption.ordinal >= 0
        ? lastOption.ordinal + 1
        : undefined;

      const reviewQuestionOption = await context.prisma.reviewQuestionOption.create({
        data: {
          option_text,
          review_question_id,
          ordinal: nextOrdinal,
        },
      });

      return reviewQuestionOption;
    },
    updateReviewQuestionOption: async (_, args, context) => {
      const { option_text, review_question_option_id } = args;

      const reviewQuestionOption = await context.prisma.reviewQuestionOption.findFirst({
        where: {
          id: review_question_option_id,
        },
      });

      invariant(reviewQuestionOption, new PublicError('Review question option not found.'));

      await reviewService.checkIsQuestionAnswered(
        { review_question_id: reviewQuestionOption?.review_question_id },
        { prisma: context.prisma },
      );

      const updatedReviewQuestionOption = await context.prisma.reviewQuestionOption.update({
        data: {
          option_text,
        },
        where: {
          id: review_question_option_id,
        },
      });

      return updatedReviewQuestionOption;
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
