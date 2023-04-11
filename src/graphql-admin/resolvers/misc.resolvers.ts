import { GraphQLScalarType, Kind } from "graphql";
import { isDate } from "moment";
import { Context } from "../../types/context";
import { Resolvers } from "../../generated";

const resolvers: Resolvers<Context> = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: 'Date custom scalar type',
    serialize(value) {
      if (isDate(value))
        return value.toISOString();
    },
    parseValue(value) {
      if (typeof value === 'string') {
        return new Date(value);
      }
    },
    parseLiteral(ast: any) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
}
