import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClient as CroDbPrismaClient } from '../../../prisma-cro/generated/client';
import { Request, Response } from "express";
import { PubSubEngine } from 'graphql-subscriptions';

export interface Context {
  prisma: PrismaClient;
  prismaCRODb: CroDbPrismaClient;
  req: Request;
  res: Response;
  pubsub: PubSubEngine;
}

export interface ServiceContext {
  prisma: PrismaClient | Prisma.TransactionClient;
  prismaCRODb?: CroDbPrismaClient;
}
