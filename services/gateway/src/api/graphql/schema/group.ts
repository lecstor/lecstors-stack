import { gql } from "apollo-server-express";

const group = gql`
  type Group {
    id: String
    name: String
    description: String
    groupId: String
    group: Group
    primaryGroupId: String
    primaryGroup: Group
    isPrimary: Boolean
    privileges: String
    type: String
    members: [User]
  }

  extend type Query {
    group(groupId: String!): Group!
    groupsTrees(groupIds: [String!]!): [[Group!]!]!
  }

  extend type Mutation {
    addMember(groupId: String!, userId: String!): Int
  }
`;

export default group;
