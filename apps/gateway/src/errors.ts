type Info = {
  userId?: string;
  username?: string;
  email?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrorResp = [string, string, Record<string, any>];

export function userNotFound(info: Info): ErrorResp {
  return ["User not found", "USER_NOT_FOUND", info];
}

export function emailExists(info: Info): ErrorResp {
  return ["Email already registered", "EMAIL_EXISTS", info];
}

export function wrongPassword(info: Info): ErrorResp {
  return ["Password is incorrect", "WRONG_PASSWORD", info];
}

export { ApolloError } from "apollo-server-express";
