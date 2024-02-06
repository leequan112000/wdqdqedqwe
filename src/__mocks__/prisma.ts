import { PrismaClient } from '@prisma/client'
import { beforeEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

beforeEach(() => {
  mockReset(prisma)
})

const prisma = mockDeep<PrismaClient>()
const prismaCRODb = mockDeep<PrismaClient>()
export { prisma, prismaCRODb }
