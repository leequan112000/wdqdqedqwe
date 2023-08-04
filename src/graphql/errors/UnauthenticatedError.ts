import { GraphQLError } from "graphql";
import { GqlErrorCode } from "../../helper/constant";

export class UnauthenticatedError extends GraphQLError {
  constructor() {
    super(`Unauthenticated: Not Authenticated`, {
      extensions: {
        code: GqlErrorCode.UNAUTHENTICATED,
        display_message: 'Not Authenticated',
      },
    });
  }
}
