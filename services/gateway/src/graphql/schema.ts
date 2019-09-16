import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";

import resolvers from "./resolvers";
import { typeDefs } from "./type-defs";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});
export default schema;
