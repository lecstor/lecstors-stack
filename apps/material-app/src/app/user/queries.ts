import gql from "graphql-tag";

export const currentUser = gql`
  query currentUser {
    currentUser {
      id
      firstname
      surname
      emails {
        email
        verified
      }
    }
  }
`;
