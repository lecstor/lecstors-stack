import gql from "graphql-tag";

const user = `
  user {
    id
    firstname
    surname
  }
`;

export const getAuth = gql`
  query GetAuth {
    auth {
      ${user}
    }
  }
`;

export const loginUser = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ${user}
    }
  }
`;
