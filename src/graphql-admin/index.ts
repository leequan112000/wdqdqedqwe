import path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { GraphQLSchema } from 'graphql';

const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers/**/*.resolvers.*')));

const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './types')));

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
