import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cookieParser from 'cookie-parser';
import { GraphQLError, GraphQLFormattedError, parse, execute } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws'
import corsConfig from './cors';
import { Context } from './types/context'
import { authMiddleware } from './middlewares/auth';
import { prisma } from './connectDB';
import routes from './routes';
import schema from './graphql/index';
import { json } from 'body-parser';
import { operationWhitelist } from './helper/graphql'
import { pubsub } from './helper/pubsub';

const app = express();

export const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
})

const serverCleanup = useServer({ schema }, wsServer);

export const apolloServer = new ApolloServer<Context>({
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
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        }
      },
    },
  ],
});

export async function startServer() {
  app.use(routes);
  app.use(express.json());
  app.use(cors(corsConfig));
  app.use(cookieParser());
  app.use(compression());
  app.use(authMiddleware);
  app.use((req, res, next) => {
    if (req.originalUrl === '/webhook/stripe' || req.originalUrl.startsWith('/webhook/pandadoc')) {
      // Do nothing with the body because Stripe / Pandadoc need it to be raw
      next();
    } else {
      // ONLY do express.json() if the received request is NOT a webhook.
      express.json()(req, res, next);
    }
  });

  app.use(
    graphqlUploadExpress({
      maxFileSize: 10000000,
      maxFiles: 10,
    }),
  );

  await apolloServer.start();

  app.use(
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
          return ({ prisma, req, res, pubsub });
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

  httpServer.listen(process.env.PORT || '9000');
}
