import { Prisma, PrismaClient } from '@prisma/client'
import { Request, Response } from "express";
import { PubSubEngine } from 'graphql-subscriptions';

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
  pubsub: PubSubEngine;
}

export interface ServiceContext {
  prisma: PrismaClient | Prisma.TransactionClient;
}
