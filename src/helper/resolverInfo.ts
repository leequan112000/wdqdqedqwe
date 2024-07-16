import { GraphQLResolveInfo } from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

function hasField(info: GraphQLResolveInfo, key: string): boolean {
  function checkFieldExist(
    obj: Record<string, any> | undefined | null,
    key: string,
  ) {
    if (obj && obj.hasOwnProperty(key)) {
      return true;
    }
    for (const prop in obj) {
      if (typeof obj[prop] === 'object' && checkFieldExist(obj[prop], key)) {
        return true;
      }
    }
    return false;
  }
  const obj: Record<string, any> | undefined | null = parseResolveInfo(info);
  return checkFieldExist(obj, key);
}

export { hasField };
