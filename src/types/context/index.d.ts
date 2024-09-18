import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClient as CroDbPrismaClient } from '../../../prisma-cro/generated/client';
import { Request, Response } from 'express';
import { PubSubEngine } from 'graphql-subscriptions';
import type { Redis } from 'ioredis';
import { PrismaClientMainDb, TransactionClientMainDb } from '../../prisma';

export interface Context {
  prisma: PrismaClientMainDb;
  prismaCRODb: CroDbPrismaClient;
  req: Request;
  res: Response;
  pubsub: PubSubEngine;
  redis: Redis;
}

export interface ServiceContext {
  prisma: PrismaClientMainDb | TransactionClientMainDb;
  prismaCRODb?: CroDbPrismaClient;
}
