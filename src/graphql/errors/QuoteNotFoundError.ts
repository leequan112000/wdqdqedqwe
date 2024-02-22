import { GraphQLError } from "graphql";
import { GqlErrorCode } from "../../helper/constant";

export class QuoteNotFoundError extends GraphQLError {
  constructor() {
    super(`Not Found: Quote not found`, {
      extensions: {
        code: GqlErrorCode.QUOTE_NOT_FOUND,
        display_message: 'Quote not found',
      },
    });
  }
}
