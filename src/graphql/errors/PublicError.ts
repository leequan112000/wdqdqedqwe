import { GraphQLError } from 'graphql';
import { GqlErrorCode } from '../../helper/constant';

export class PublicError extends GraphQLError {
  constructor(message: string) {
    super(`${message}`, {
      extensions: {
        code: GqlErrorCode.PUBLIC_ERROR,
        display_message: message,
      },
    });
  }
}
