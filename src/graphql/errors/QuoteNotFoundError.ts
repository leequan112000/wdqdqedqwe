import { GraphQLError } from "graphql";
import { GqlErrorCode } from "../../helper/constant";

export class QuoteNotFoundError extends GraphQLError {
  constructor() {
    super(`Unauthenticated: Not Authenticated`, {
      extensions: {
        code: GqlErrorCode.QUOTE_NOT_FOUND,
        display_message: 'Quote not found',
      },
    });
  }
}
