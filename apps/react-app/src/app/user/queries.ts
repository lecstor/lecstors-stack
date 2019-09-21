import gql from "graphql-tag";

export const deleteUser = gql`
  mutation DeleteUser {
    deleteUser {
      user {
        id
      }
    }
  }
`;
