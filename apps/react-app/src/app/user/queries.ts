import gql from "graphql-tag";

import { authProps } from "../../auth/queries";

export const currentUser = gql`
  query currentUser {
    currentUser {
      id
      firstname
      surname
      emails {
        email
        verified
        verificationTokens {
          id
          status
        }
      }
    }
  }
`;

export const verifyEmail = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      ${authProps}
    }
  }
`;
