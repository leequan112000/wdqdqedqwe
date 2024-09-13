import { Prisma, PrismaClient as PrismaClientMainDb } from '@prisma/client';
import { PrismaClient as PrismaClientCRODb } from '../prisma-cro/generated/client';
import { decrypt, encrypt } from './helper/gdprHelper';
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

const prisma: PrismaClientMainDb<
  Prisma.PrismaClientOptions,
  'query' | 'info' | 'warn' | 'error'
> = new PrismaClientMainDb({
  log,
}).$extends(userPseudonymExtension) as unknown as PrismaClientMainDb;

if (logQuery) {
  prisma.$on('query', (e) => {
    console.log('Prisma Main DB:');
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

const prismaCRODb: PrismaClientCRODb<
  Prisma.PrismaClientOptions,
  'query' | 'info' | 'warn' | 'error'
> = new PrismaClientCRODb({
  log,
});

if (logQuery) {
  prismaCRODb.$on('query', (e) => {
    console.log('Prisma CRO DB:');
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

export { prisma, prismaCRODb };
