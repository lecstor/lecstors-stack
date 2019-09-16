import { Request } from "express";

import passport from "passport";

const promisifiedAuthenticate = (req, res, name, options) =>
  new Promise((resolve, reject) =>
    passport.authenticate(name, options, (err, user, info) => {
      if (err) reject(err);
      else resolve({ user, info });
    })(req, res)
  );

const promisifiedLogin = (req, user, options) =>
  new Promise((resolve, reject) =>
    req.login(user, options, err => {
      if (err) reject(err);
      else resolve();
    })
  );

export function getContext({ req, res }: { req: Request; res: Response }) {
  const { isAuthenticated, isUnauthenticated } = req;
  return {
    auth: {
      authenticate: (name, options) =>
        promisifiedAuthenticate(req, res, name, options),
      isAuthenticated,
      isUnauthenticated,
      login: (user, options) => promisifiedLogin(req, user, options),
      logout: () => req.logout()
    },
    user: req.user
  };
}
