import { GraphQLError } from "graphql";
import { GQL_ERROR_CODE } from "../../helper/constant";

export class UnauthenticatedError extends GraphQLError {
  constructor() {
    super(`Unauthenticated: Not Authenticated`, {
      extensions: {
        code: GQL_ERROR_CODE.UNAUTHENTICATED,
        display_message: 'Not Authenticated',
      },
    });
  }
}
