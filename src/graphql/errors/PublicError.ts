import { GraphQLError } from 'graphql';
import { GQL_ERROR_CODE } from '../../helper/constant';

export class PublicError extends GraphQLError {
  constructor(message: string) {
    super(`${message}`, {
      extensions: {
        code: GQL_ERROR_CODE.PUBLIC_ERROR,
        display_message: message,
      },
    });
  }
}
