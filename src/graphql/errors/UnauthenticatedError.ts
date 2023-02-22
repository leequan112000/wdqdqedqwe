import { GraphQLError } from "graphql";

export class UnauthenticatedError extends GraphQLError {
  constructor() {
    super(`Unauthenticated: Not Authenticated`, {
      extensions: {
        code: 'UNAUTHENTICATED',
        display_message: 'Not Authenticated',
      },
    });
  }
}
