import { IResolvers } from "graphql-tools";

import * as userQueries from "../models/user/gql-queries";

const resolverMap: IResolvers = {
  Query: {
    ...userQueries
  }
  // Mutation: { }
};

export default resolverMap;
