import { GraphQLError } from "graphql";

export class NotFoundError extends GraphQLError {
  constructor(url: string | undefined = undefined) {
    super('Redirect', {
      extensions: { code: 'NOT_FOUND', url: url || '/app' },
    });
  }
}
