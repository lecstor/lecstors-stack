export { ApolloError } from "apollo-server-express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorResp = [string, string, Record<string, any>];

export type ErrorInfo = {
  userId?: string;
  username?: string;
  email?: string;
};

/*
  Throw ApolloErrors from reducer code for accurate stacktrace
  ```
  throw new ApolloError(...emailExists({ email }));
  ```
*/

export function userNotFound(info: ErrorInfo = {}): ErrorResp {
  return ["User not found", "USER_NOT_FOUND", info];
}

export function emailExists(info: ErrorInfo = {}): ErrorResp {
  return ["Email already registered", "EMAIL_EXISTS", info];
}

export function verificationTokenNotFound(info: ErrorInfo = {}): ErrorResp {
  return ["Verification token not found", "VERIFICATION_TOKEN_NOT_FOUND", info];
}

export function wrongPassword(info: ErrorInfo = {}): ErrorResp {
  return ["Password is incorrect", "WRONG_PASSWORD", info];
}

export function fillError(
  error: Error & { code?: string; info?: ErrorInfo },
  data: ErrorResp
) {
  const [message, code, info] = data;
  error.message = message;
  error.code = code;
  error.info = info;
  return error;
}
