import { Prisma, PrismaClient, ReviewQuestion } from '@prisma/client';
import { PublicError } from '../../graphql/errors/PublicError';
import invariant from '../../helper/invariant';
import { OrdinalAction } from '../../helper/constant';
import { sortBy } from 'lodash';

const QUOTE_REVIEW_QUESTION_SET_ID =
  process.env.QUOTE_REVIEW_QUESTION_SET_ID || '';

interface ServiceContext {
  prisma: PrismaClient | Prisma.TransactionClient;
}

type GetQuoteReviewQuestionsArgs = {
  quote_id: string;
  current_user_id: string;
};

const getQuoteReviewQuestions = async (
  args: GetQuoteReviewQuestionsArgs,
  context: ServiceContext,
) => {
  const { current_user_id, quote_id } = args;
  // Check if quote review exists?
  const review = await context.prisma.review.findFirst({
    where: {
      quote_review: {
        quote_id,
      },
      user_id: current_user_id,
    },
    include: {
      review_question_set: {
        include: {
          review_questions: true,
        },
      },
    },
  });

  if (review?.review_question_set?.review_questions) {
    return review.review_question_set.review_questions;
  }

  const reviewQuestions = await context.prisma.reviewQuestion.findMany({
    where: {
      review_question_set_id: QUOTE_REVIEW_QUESTION_SET_ID,
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
};

type DraftQuoteReviewArgs = {
  review_input: Array<{
    review_question_id: string;
    answer_text?: string | null;
    rating_value?: number | null;
    option_value?: string | null;
  }>;
  current_user_id: string;
  quote_id: string;
  is_final?: boolean;
};

const draftQuoteReview = async (
  args: DraftQuoteReviewArgs,
  context: ServiceContext,
) => {
  const { current_user_id, quote_id, review_input, is_final } = args;
  // Check if review & quote record exist

  let review = await context.prisma.review.findFirst({
    where: {
      quote_review: {
        quote_id,
      },
      user_id: current_user_id,
      review_question_set_id: QUOTE_REVIEW_QUESTION_SET_ID,
    },
    include: {
      quote_review: true,
    },
  });

  if (review === null) {
    review = await context.prisma.review.create({
      data: {
        user_id: current_user_id,
        review_question_set_id: QUOTE_REVIEW_QUESTION_SET_ID,
        is_draft: true,
        quote_review: {
          create: {
            quote_id,
          },
        },
      },
      include: {
        quote_review: true,
      },
    });
  }

  invariant(review, 'Review is null');

  if (is_final === true) {
    await context.prisma.review.update({
      data: {
        is_draft: false,
      },
      where: {
        id: review.id,
      },
    });
  }

  // Create / upsert review answer
  const promises = review_input.map(async (ri) => {
    if (ri?.review_question_id) {
      return await context.prisma.reviewAnswer.upsert({
        where: {
          review_id_review_question_id: {
            review_id: review!.id,
            review_question_id: ri.review_question_id,
          },
        },
        create: {
          answer_text: ri.answer_text,
          option_value: ri.option_value,
          rating_value: ri.rating_value,
          review_question_id: ri.review_question_id,
          review_id: review!.id,
        },
        update: {
          answer_text: ri.answer_text,
          option_value: ri.option_value,
          rating_value: ri.rating_value,
        },
      });
    } else {
      return await context.prisma.reviewAnswer.create({
        data: {
          answer_text: ri.answer_text,
          option_value: ri.option_value,
          rating_value: ri.rating_value,
          review_question_id: ri.review_question_id,
          review_id: review!.id,
        },
      });
    }
  });

  const reviewAnswers = await Promise.all(promises);

  return reviewAnswers;
};

type CheckIsQuestionAnsweredArgs = {
  review_question_id: string;
};

const checkIsQuestionAnswered = async (
  args: CheckIsQuestionAnsweredArgs,
  context: ServiceContext,
) => {
  const { review_question_id } = args;
  const reviewQuestion = await context.prisma.reviewQuestion.findFirst({
    where: {
      id: review_question_id,
    },
    include: {
      review_question_set: {
        include: {
          reviews: {
            take: 1,
          },
        },
      },
    },
  });

  invariant(reviewQuestion, new PublicError('Review question not found.'));

  invariant(
    reviewQuestion.review_question_set.reviews.length === 0,
    new PublicError('The question is answered.'),
  );

  return reviewQuestion;
};

type CheckIsQuestionSetAnsweredArgs = {
  review_question_set_id: string;
};

const checkIsQuestionSetAnswered = async (
  args: CheckIsQuestionSetAnsweredArgs,
  context: ServiceContext,
) => {
  const { review_question_set_id } = args;
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

  invariant(
    reviewQuestionSet,
    new PublicError('Review question set not found.'),
  );
  invariant(
    reviewQuestionSet.reviews.length === 0,
    new PublicError('Review question set is answered'),
  );

  return reviewQuestionSet;
};

type ShiftQuestionsArgs = {
  review_question_set_id: string;
  ordinal: number;
  exclude_question_id?: string;
};

const shiftQuestions = async (
  args: ShiftQuestionsArgs,
  context: ServiceContext,
) => {
  const { ordinal, review_question_set_id, exclude_question_id } = args;

  const existingQuestions = await context.prisma.reviewQuestion.findMany({
    where: {
      review_question_set_id,
      ...(exclude_question_id
        ? {
            id: {
              not: exclude_question_id,
            },
          }
        : {}),
    },
    orderBy: {
      ordinal: 'desc',
    },
  });

  let questionsToShift: ReviewQuestion[] = existingQuestions.filter(
    (q) => q.ordinal >= ordinal,
  );

  const sorted = sortBy(questionsToShift, 'ordinal');
  const shiftTasks = sorted.map(async (q) => {
    await context.prisma.reviewQuestion.update({
      where: {
        id: q.id,
      },
      data: {
        ordinal: q.ordinal + 1,
      },
    });
  });
  await Promise.all(shiftTasks);
};

const reviewService = {
  getQuoteReviewQuestions,
  draftQuoteReview,
  checkIsQuestionAnswered,
  checkIsQuestionSetAnswered,
  shiftQuestions,
};

export default reviewService;
