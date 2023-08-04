import { GraphQLError } from "graphql";
import { GQL_ERROR_CODE } from "../../helper/constant";

export class PermissionDeniedError extends GraphQLError {
  constructor(url: string | undefined = undefined) {
    super('Permission denied!', {
      extensions: { code: GQL_ERROR_CODE.PERMISSION_DENIED, url: url || '/app' },
    });
  }
}
