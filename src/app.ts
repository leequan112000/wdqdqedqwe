import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import { context } from './context';
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
      context,
      validationRules: [depthLimit(7)],
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: this.server, path: '/graphql' });
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use('*', cors());
    this.server.use(compression());
  }

  routes() {
    this.server.use(routes);
  }
}

export default createServer(new App().server);