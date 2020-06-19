import { Request, Response } from "express";
import passport from "passport";

import User from "../../db/models/user/user.model";
import { PrivilegesMap } from "@lecstor/privileges";

export type Context = {
  auth: {
    authenticate: (
      strategy: string,
      credentials: { username: string; password: string }
    ) => Promise<{ user: User; info: any }>;
    isAuthenticated: boolean;
    isUnauthenticated: boolean;
    login: (user: User, options?: any) => Promise<void>;
    logout: () => void;
    userCan: (privilege: string, groupId: string) => Promise<PrivilegesMap>;
  };
  authUser: User;
};

const promisifiedAuthenticate = (
  req: Request,
  res: Response,
  name: string | string[],
  options: passport.AuthenticateOptions
) =>
  new Promise((resolve, reject) =>
    passport.authenticate(name, options, (err, user, info) => {
      if (err) reject(err);
      else resolve({ user, info });
    })(req, res)
  );

const promisifiedLogin = (req: Request, user: Express.User, options: any) =>
  new Promise((resolve, reject) =>
    req.login(user, options, (err) => {
      if (err) reject(err);
      else resolve();
    })
  );

export function getContext({ req, res }: { req: Request; res: Response }) {
  const { isAuthenticated, isUnauthenticated } = req;
  return {
    auth: {
      authenticate: (name: string, options: passport.AuthenticateOptions) =>
        promisifiedAuthenticate(req, res, name, options),
      isAuthenticated,
      isUnauthenticated,
      login: (user: Express.User, options: any) =>
        promisifiedLogin(req, user, options),
      logout: () => req.logout(),
    },
    authUser: req.user,
  };
}
