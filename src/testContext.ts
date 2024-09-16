import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClientMainDb } from './prisma';

export type MockContext = {
  prisma: DeepMockProxy<PrismaClientMainDb>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClientMainDb>(),
  };
};
