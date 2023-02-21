import { ApolloError } from 'apollo-server-express';

export class PublicError extends ApolloError {
  constructor(message: string) {
    super(`Public Error: ${message}`, 'PUBLIC_ERROR_CODE', {
      display_message: message,
    });
  }
}
