import * as Sentry from "@sentry/node";

import { prisma, prismaCRODb } from "./prisma";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Prisma({ client: prisma }),
    new Sentry.Integrations.Prisma({ client: prismaCRODb }),
    new Sentry.Integrations.GraphQL(),
  ],
  release: process.env.SENTRY_RELEASE,
});

export default Sentry;
