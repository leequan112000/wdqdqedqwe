import { GraphQLError } from "graphql";

export class PermissionDeniedError extends GraphQLError {
  constructor(url: string | undefined = undefined) {
    super('Permission denied!', {
      extensions: { code: 'PERMISSION_DENIED', url: url || '/app' },
    });
  }
}
