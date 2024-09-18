import { Prisma, PrismaClient as MainPrismaClient } from '@prisma/client';
import { PrismaClient as CroPrismaClient } from '../prisma-cro/generated/client';
import { userPseudonymExtension } from './extensions/userPseudonymExtension';

const logQuery = process.env.LOG_PRISMA_QUERY === 'true';

const log: Array<Prisma.LogLevel | Prisma.LogDefinition> = [
  {
    emit: 'stdout',
    level: 'info',
  },
  ...(logQuery
    ? [
        {
          emit: 'stdout',
          level: 'query',
        } as Prisma.LogDefinition,
      ]
    : []),
];

export const prismaClient: MainPrismaClient<
  Prisma.PrismaClientOptions,
  'query' | 'info' | 'warn' | 'error'
> = new MainPrismaClient({
  log,
});

if (logQuery) {
  prismaClient.$on('query', (e) => {
    console.log('Prisma Main DB:');
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

const prismaCRODb: CroPrismaClient<
  Prisma.PrismaClientOptions,
  'query' | 'info' | 'warn' | 'error'
> = new CroPrismaClient({
  log,
});

if (logQuery) {
  prismaCRODb.$on('query', (e) => {
    console.log('Prisma CRO DB:');
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

const prismaMainDb = prismaClient.$extends(userPseudonymExtension);

export { prismaMainDb as prisma, prismaCRODb };

export type PrismaClientMainDb = typeof prismaMainDb;
export type TransactionClientMainDb = Parameters<
  Parameters<PrismaClientMainDb['$transaction']>[0]
>[0];

export type User = Prisma.Result<
  typeof prismaMainDb.user,
  {},
  'findFirstOrThrow'
>;
