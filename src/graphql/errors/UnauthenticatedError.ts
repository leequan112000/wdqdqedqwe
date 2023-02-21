import { ApolloError } from 'apollo-server-express';

export class UnauthenticatedError extends ApolloError {
  constructor() {
    super('Not Authenticated', 'UNAUTHENTICATED', {
      display_message: 'Not Authenticated',
    });
  }
}
