import { PrismaClient } from '@prisma/client';
import prisma from './prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

async function connectDB() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

export default connectDB;
