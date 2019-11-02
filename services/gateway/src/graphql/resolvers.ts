import { IResolvers } from "graphql-tools";

import * as userQueries from "../models/user/gql-queries";
import * as authQueries from "../models/auth/gql-queries";
import * as authMutations from "../models/auth/gql-mutations";

const resolverMap: IResolvers = {
  Query: {
    ...authQueries,
    ...userQueries
  },
  Mutation: {
    ...authMutations
  }
};

export default resolverMap;
