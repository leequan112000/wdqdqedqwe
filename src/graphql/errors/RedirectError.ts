import { GraphQLError } from "graphql";

export class RedirectError extends GraphQLError {
  constructor(url: string | undefined = undefined) {
    super('Redirect', {
      extensions: { code: 'REDIRECT_CODE', url: url || '/app' },
    });
  }
}
