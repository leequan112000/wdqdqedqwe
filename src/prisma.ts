import { PrismaClient as PrismaClientMainDb } from '@prisma/client';
import { PrismaClient as PrismaClientCRODb } from '../prisma-cro/generated/client';

const prisma = new PrismaClientMainDb({ log: ['info'] });
const prismaCRODb = new PrismaClientCRODb({ log: ['info'] });

export { prisma, prismaCRODb };
