import { GraphQLError } from "graphql";
import { GqlErrorCode } from "../../helper/constant";

export class PermissionDeniedError extends GraphQLError {
  constructor(url: string | undefined = undefined) {
    super('Permission denied!', {
      extensions: { code: GqlErrorCode.PERMISSION_DENIED, url: url || '/app' },
    });
  }
}
