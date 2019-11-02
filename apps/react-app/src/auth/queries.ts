import gql from "graphql-tag";

export const userProps = `
  id
  firstname
  surname
  emails {
    email
  }
`;

export const authProps = `
  user {
    ${userProps}
  }
`;

export const getAuth = gql`
  query GetAuth {
    auth {
      ${authProps}
    }
  }
`;

export const getTokens = gql`
  query GetTokens($email: String) {
    tokens(email: $email) {
      id
    }
  }
`;

export const registerUser = gql`
  mutation RegisterUser($firstname: String, $surname: String, $email: String!) {
    createUser(firstname: $firstname, surname: $surname, email: $email) {
      ${authProps}
    }
  }
`;

export const loginUser = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ${authProps}
    }
  }
`;

export const logoutUser = gql`
  mutation LogoutUser {
    logoutUser {
      user {
        id
      }
    }
  }
`;

export const deleteUser = gql`
  mutation DeleteUser {
    deleteUser {
      user {
        id
      }
    }
  }
`;
