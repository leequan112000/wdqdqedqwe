import { GraphQLError } from 'graphql';

export class PublicError extends GraphQLError {
  constructor(message: string) {
    super(`PublicError: ${message}`, {
      extensions: {
        code: 'PUBLIC_ERROR_CODE',
        display_message: message,
      },
    });
  }
}
