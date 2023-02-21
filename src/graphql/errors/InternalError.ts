import { ApolloError } from 'apollo-server-express';

export class InternalError extends ApolloError {
  constructor(message: string, meta: any) {
    super(`Internal Error: ${message}`, 'INTERNAL_ERROR_CODE', {
      ...meta,
    });
  }
}
