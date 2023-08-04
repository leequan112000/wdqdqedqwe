import { GraphQLError } from 'graphql';
import { GqlErrorCode } from '../../helper/constant';

export class InternalError extends GraphQLError {
  constructor(message: string, meta: any = {}) {
    super(`InternalError: ${message}`, {
      extensions: {
        code: GqlErrorCode.INTERNAL_ERROR,
        ...meta,
      },
    });
  }
}
