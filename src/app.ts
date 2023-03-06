import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cookieParser from 'cookie-parser';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'
import corsConfig from './cors';
import { Context } from './types/context'
import { authMiddleware } from './middlewares/auth';
import routes from './routes';
import schema from './graphql/index';
import { json } from 'body-parser';
import { operationWhitelist } from './helper/graphql'

class App {
  public server;

  constructor() {
    this.server = express();

    this.routes();
    this.middlewares();
    this.apolloServer();
  }

  async apolloServer() {
    const prisma = new PrismaClient()
    const apolloServer = new ApolloServer<Context>({
      schema,
      validationRules: [depthLimit(7)],
      introspection: process.env.NODE_ENV === 'development',
      formatError: (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
        const errorMap = {
          'PublicError:': 'PUBLIC_ERROR_CODE',
          'InternalError:': 'INTERNAL_ERROR_CODE',
          'Unauthenticated:': 'UNAUTHENTICATED'
        };

        for (const [prefix, code] of Object.entries(errorMap)) {
          if (formattedError.message.startsWith(prefix)) {
            return {
              ...formattedError,
              message: formattedError.message.replace(new RegExp(`^${prefix} `), ''),
              extensions: { ...formattedError?.extensions, code },
            };
          }
        }

        return formattedError;
      },
    });
    await apolloServer.start();
    this.server.use(
      '/graphql',
      cors<cors.CorsRequest>(corsConfig),
      json(),
      expressMiddleware<Context>(apolloServer, {
        context: async ({ req, res }) => {
          const operationName = req.body?.operationName;
          const isWhitelisted = operationWhitelist.includes(operationName);
          if (
            // bypass authentication for codegen
            (process.env.NODE_ENV === 'development' && req.headers.authorization === 'codegen')
            // if user_id exist
            || req.user_id
            // bypass authentication for whitelisted operation, eg. signIn and signUp
            || isWhitelisted
          ) {
            return ({ prisma, req, res });
          }

          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        },
      }),
    );
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors(corsConfig));
    this.server.use(cookieParser());
    this.server.use(compression());
    this.server.use(authMiddleware);
    this.server.use((req, res, next) => {
      if (req.originalUrl === '/webhook/stripe' || req.originalUrl.startsWith('/webhook/pandadoc')) {
        // Do nothing with the body because Stripe / Pandadoc need it to be raw
        next();
      } else {
        // ONLY do express.json() if the received request is NOT a webhook.
        express.json()(req, res, next);
      }
    });
  }

  routes() {
    this.server.use(routes);
  }
}

export default createServer(new App().server);
