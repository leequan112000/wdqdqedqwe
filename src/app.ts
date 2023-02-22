import express from 'express';
import { ApolloError, ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import { GraphQLError } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import corsConfig from './cors';
import { context } from './context';
import { authMiddleware } from './middlewares/auth';
import routes from './routes';
import schema from './graphql/index';

class App {
  public server;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.apolloServer();
  }

  async apolloServer() {
    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ ...context, req, res }),
      validationRules: [depthLimit(7)],
      formatError: (error: GraphQLError) => {
        const graphqlErrorCode = error.extensions.code;
        switch (graphqlErrorCode) {
          // Returning public error before sending slack error to skip reporting public error
          case 'PUBLIC_ERROR_CODE': {
            return new ApolloError(String(error.extensions.display_message), 'PUBLIC_ERROR_CODE');
          }
          case 'UNAUTHENTICATED': {
            return error;
          }
          case 'INTERNAL_ERROR_CODE':
          default: {
            console.log(error);
            return new ApolloError('Something went wrong.');
          }
        }
      },
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
      app: this.server,
      path: '/graphql',
      cors: false, // false because we are using our own cors middleware 
    });
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors(corsConfig));
    this.server.use(cookieParser());
    this.server.use(compression());
    this.server.use(authMiddleware);
  }

  routes() {
    this.server.use(routes);
  }
}

export default createServer(new App().server);