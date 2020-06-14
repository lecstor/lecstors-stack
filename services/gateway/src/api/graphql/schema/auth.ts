import { gql } from "apollo-server-express";

const auth = gql`
  type Credentials {
    id: String
    providerId: String
    secret: String
    userId: String
  }

  type Auth {
    user: User
  }

  extend type Query {
    auth: Auth
  }
`;

export default auth;
