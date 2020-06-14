import { gql } from "apollo-server-express";
// import { makeExecutableSchema, mergeSchemas } from "graphql-tools";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";
// import { builder as graphQlBuilder } from "objection-graphql";

// import Group from "../../../db/models/group/group.model";

import resolvers from "../resolvers";

import auth from "./auth";
import group from "./group";
import user from "./user";

const base = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

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
