import { Review, ReviewAnswer, ReviewQuestion } from "@prisma/client";
import { expect, test, beforeEach, describe } from 'vitest';
import { MockContext, createMockContext } from "../../testContext";
import { ServiceContext } from "../../types/context";
import reviewService from "./review.service";
import { OrdinalAction } from "../../helper/constant";

let mockCtx: MockContext;
let ctx: ServiceContext;

let existingQuestions: ReviewQuestion[];
let existingReview: Review;
let existingAnswers: ReviewAnswer[];

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as ServiceContext;
  existingQuestions = [
    {
      id: 'id-01',
      created_at: new Date(),
      updated_at: new Date(),
      group_title: 'Group A',
      is_required: true,
      ordinal: 1,
      review_question_set_id: 'id-01',
      question_text: 'Text',
      question_type: 'Type',
    },
    {
      id: 'id-02',
      created_at: new Date(),
      updated_at: new Date(),
      group_title: 'Group A',
      is_required: true,
      ordinal: 2,
      review_question_set_id: 'id-01',
      question_text: 'Text',
      question_type: 'Type',
    },
    {
      id: 'id-03',
      created_at: new Date(),
      updated_at: new Date(),
      group_title: 'Group A',
      is_required: true,
      ordinal: 3,
      review_question_set_id: 'id-01',
      question_text: 'Text',
      question_type: 'Type',
    },
  ];
  existingReview = {
    id: 'id',
    user_id: 'current-user-id',
    review_question_set_id: 'review-question-set-id',
    is_draft: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  existingAnswers = [
    {
      id: 'answer-id-01',
      review_id: 'review-id',
      review_question_id: 'review-question-id-1',
      answer_text: 'Text',
      option_value: null,
      rating_value: null,
    },
    {
      id: 'answer-id-02',
      review_id: 'review-id',
      review_question_id: 'review-question-id-2',
      answer_text: null,
      option_value: null,
      rating_value: 2,
    },
  ];
});

describe('review.service', () => {
  describe('shiftQuestion', () => {
    test('ordinal action: insert', async () => {

      mockCtx.prisma.reviewQuestion.findMany.mockResolvedValueOnce(existingQuestions);

      await reviewService.shiftQuestions({
        ordinal: 2,
        review_question_set_id: 'id-01',
      }, ctx);

      expect(mockCtx.prisma.reviewQuestion.update).toBeCalledTimes(2);
      expect(mockCtx.prisma.reviewQuestion.update).toHaveBeenNthCalledWith(
        1,
        {
          where: {
            id: existingQuestions[1].id,
          },
          data: {
            ordinal: existingQuestions[1].ordinal + 1,
          },
        },
      );
      expect(mockCtx.prisma.reviewQuestion.update).toHaveBeenNthCalledWith(
        2,
        {
          where: {
            id: existingQuestions[2].id,
          },
          data: {
            ordinal: existingQuestions[2].ordinal + 1,
          },
        },
      );
    });
  });

  describe('draftQuoteReview', () => {
    test('should return existing answers', async () => {
      mockCtx.prisma.review.findFirst.mockResolvedValueOnce(existingReview);
      mockCtx.prisma.reviewAnswer.upsert
        .mockResolvedValueOnce(existingAnswers[0])
        .mockResolvedValueOnce(existingAnswers[1]);

      const reviewAnswers = await reviewService.draftQuoteReview(
        {
          current_user_id: 'current-user-id',
          quote_id: 'quote-id',
          review_input: [
            {
              review_question_id: 'review-question-id-1',
              answer_text: 'Text',
            },
            {
              review_question_id: 'review-question-id-1',
              rating_value: 2,
            },
          ],
          is_final: false,
        },
        ctx,
      )

      expect(mockCtx.prisma.review.create).not.toBeCalled();
      expect(reviewAnswers).toEqual(existingAnswers);
    });

    test('should mark review as not draft', async () => {
      mockCtx.prisma.review.findFirst.mockResolvedValueOnce(existingReview);
      mockCtx.prisma.reviewAnswer.upsert
        .mockResolvedValueOnce(existingAnswers[0])
        .mockResolvedValueOnce(existingAnswers[1]);

      const reviewAnswers = await reviewService.draftQuoteReview(
        {
          current_user_id: 'current-user-id',
          quote_id: 'quote-id',
          review_input: [
            {
              review_question_id: 'review-question-id-1',
              answer_text: 'Text',
            },
            {
              review_question_id: 'review-question-id-1',
              rating_value: 2,
            },
          ],
          is_final: true,
        },
        ctx,
      )

      expect(mockCtx.prisma.review.create).not.toBeCalled();
      expect(mockCtx.prisma.review.update).toBeCalled()
      expect(reviewAnswers).toEqual(existingAnswers);
    });
  });
});
