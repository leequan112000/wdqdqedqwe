import { GraphQLError } from 'graphql';
import { GQL_ERROR_CODE } from '../../helper/constant';

export class InternalError extends GraphQLError {
  constructor(message: string, meta: any = {}) {
    super(`InternalError: ${message}`, {
      extensions: {
        code: GQL_ERROR_CODE.INTERNAL_ERROR,
        ...meta,
      },
    });
  }
}
