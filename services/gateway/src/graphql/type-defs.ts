import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Credentials {
    id: String
    providerId: String
    secret: String
    userId: String
  }

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
    emails: [Email]
    credentials: [Credentials]
  }

  type Auth {
    user: User
  }

  type Query {
    auth: Auth
    currentUser: User
    user(id: String): User
    tokens(email: String): [EmailVerificationToken]
  }

  input CredentialsInput {
    providerId: String
    secret: String
  }

  type Mutation {
    createUser(firstname: String, surname: String, email: String!): Auth
    login(username: String!, password: String!): Auth
    verifyEmail(token: String!): Auth

    deleteUser: Auth

    logout: Auth
  }
`;
