import { gql } from "apollo-server-express";

const user = gql`
  type Email {
    email: String
    verified: Boolean
    userId: String
    verificationTokens: [EmailVerificationToken]
  }

  type EmailVerificationToken {
    id: String
    emailId: String
    status: String
    email: Email
  }

  type User {
    id: String
    firstname: String
    surname: String
    email: String
    emails: [Email]
    credentials: [Credentials]
  }

  extend type Query {
    currentUser: User
    user(userId: String): User
    tokens(email: String): [EmailVerificationToken]
  }

  extend type Mutation {
    createUser(
      firstname: String
      surname: String
      email: String!
      groupId: String!
    ): User
    login(username: String!, password: String!): Auth
    verifyEmail(token: String!): Auth

    deleteUser: Auth

    logout: Auth
  }
`;

export default user;
