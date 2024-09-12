import { Prisma, PrismaClient as PrismaClientMainDb } from '@prisma/client';
import { PrismaClient as PrismaClientCRODb } from '../prisma-cro/generated/client';
import { decrypt } from './helper/gdprHelper';

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
}).$extends({
  result: {
    userPseudonyms: {
      first_name: {
        needs: { first_name: true },
        compute({ first_name }) {
          console.log('first_name', first_name);
          console.log();
          return decrypt(first_name);
        },
      },
      last_name: {
        needs: { last_name: true },
        compute({ last_name }) {
          console.log(last_name);
          return decrypt(last_name);
        },
      },
      email: {
        needs: { email: true },
        compute({ email }) {
          return decrypt(email);
        },
      },
      phone_number: {
        needs: { phone_number: true },
        compute({ phone_number }) {
          return decrypt(phone_number);
        },
      },
      country_code: {
        needs: { country_code: true },
        compute({ country_code }) {
          return decrypt(country_code);
        },
      },
    },
  },
}) as unknown as PrismaClientMainDb;

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
