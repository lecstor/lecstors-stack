// import { makeExecutableSchema, mergeSchemas } from "graphql-tools";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";
// import { builder as graphQlBuilder } from "objection-graphql";

// import Group from "../../../db/models/group/group.model";

import resolvers from "../resolvers";

import auth from "./auth";
import base from "./base";
import group from "./group";
import user from "./user";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [base, auth, group, user],
  resolvers,
});

export default schema;

// export default mergeSchemas({
//   schemas: [
//     schema,
//     graphQlBuilder()
//       .model(Group)
//       .build()
//   ]
// });
