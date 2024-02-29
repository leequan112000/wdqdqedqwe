import { PrismaClient } from '@prisma/client';
import { prisma } from './prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

if (process.env.APP_ENV !== 'production') {
  global.prisma = prisma;
}
