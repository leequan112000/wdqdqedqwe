import { GraphQLError } from 'graphql';
import { GqlErrorCode } from '../../helper/constant';

export class NoOAuthError extends GraphQLError {
  constructor(meta: any = {}) {
    super(`InternalError: No OAuth Found`, {
      extensions: {
        code: GqlErrorCode.INTERNAL_ERROR,
        ...meta,
      },
    });
  }
}
