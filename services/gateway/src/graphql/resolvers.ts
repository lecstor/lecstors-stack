import { IResolvers } from "graphql-tools";

import * as userQueries from "../models/user/gql-queries";
import * as userMutations from "../models/user/gql-mutations";
import * as authQueries from "../models/auth/gql-queries";
import * as authMutations from "../models/auth/gql-mutations";

const resolverMap: IResolvers = {
  Query: {
    ...authQueries,
    ...userQueries
  },
  Mutation: {
    ...authMutations,
    ...userMutations
  }
};

export default resolverMap;
