import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cookieParser from 'cookie-parser';
import { GraphQLFormattedError } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import corsConfig from './cors';
import { Context, context } from './context';
import { authMiddleware } from './middlewares/auth';
import routes from './routes';
import schema from './graphql/index';
import { json } from 'body-parser';

class App {
  public server;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.apolloServer();
  }

  async apolloServer() {
    const apolloServer = new ApolloServer<Context>({
      schema,
      validationRules: [depthLimit(7)],
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
      expressMiddleware(apolloServer, {
        context: async ({ req, res }) => ({ ...context, req, res }),
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
      if (req.originalUrl === '/webhook/stripe') {
        // Do nothing with the body because Stripe need it to be raw
        next();
      } else {
        // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
        express.json()(req, res, next);
      }
    });
  }

  routes() {
    this.server.use(routes);
  }
}

export default createServer(new App().server);