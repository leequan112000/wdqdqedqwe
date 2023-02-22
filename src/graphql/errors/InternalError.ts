import { GraphQLError } from 'graphql';

export class InternalError extends GraphQLError {
  constructor(message: string, meta: any) {
    super(`InternalError: ${message}`, {
      extensions: {
        code: 'INTERNAL_ERROR_CODE',
        ...meta,
      },
    });
  }
}
