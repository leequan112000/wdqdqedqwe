import { ReviewQuestion } from "@prisma/client";
import { expect, test, beforeEach, describe } from 'vitest';
import { MockContext, createMockContext } from "../../testContext";
import { ServiceContext } from "../../types/context";
import reviewService from "./review.service";
import { OrdinalAction } from "../../helper/constant";

let mockCtx: MockContext;
let ctx: ServiceContext;

let existingQuestions: ReviewQuestion[];

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
});

describe('review.service', () => {
  describe('shiftQuestion', () => {
    test('ordinal action: insert', async () => {

      mockCtx.prisma.reviewQuestion.findMany.mockResolvedValueOnce(existingQuestions);

      await reviewService.shiftQuestions({
        ordinal: 2,
        ordinal_action: OrdinalAction.INSERT,
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

    test('ordinal action: after', async () => {
      mockCtx.prisma.reviewQuestion.findMany.mockResolvedValueOnce(existingQuestions);

      await reviewService.shiftQuestions({
        ordinal: 2,
        ordinal_action: OrdinalAction.AFTER,
        review_question_set_id: 'id-01',
      }, ctx);

      expect(mockCtx.prisma.reviewQuestion.update).toBeCalledTimes(1);
      expect(mockCtx.prisma.reviewQuestion.update).toHaveBeenNthCalledWith(
        1,
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

    test('ordinal action: before', async () => {
      mockCtx.prisma.reviewQuestion.findMany.mockResolvedValueOnce(existingQuestions);

      await reviewService.shiftQuestions({
        ordinal: 2,
        ordinal_action: OrdinalAction.BEFORE,
        review_question_set_id: 'id-01',
      }, ctx);

      expect(mockCtx.prisma.reviewQuestion.update).toBeCalledTimes(3);
      expect(mockCtx.prisma.reviewQuestion.update).toHaveBeenNthCalledWith(
        1,
        {
          where: {
            id: existingQuestions[0].id,
          },
          data: {
            ordinal: existingQuestions[0].ordinal + 1,
          },
        },
      );
      expect(mockCtx.prisma.reviewQuestion.update).toHaveBeenNthCalledWith(
        2,
        {
          where: {
            id: existingQuestions[1].id,
          },
          data: {
            ordinal: existingQuestions[1].ordinal + 1,
          },
        },
      );
    });
  });
});
