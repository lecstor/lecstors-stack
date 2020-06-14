import passport from "passport";
import PassportLocal from "passport-local";

import { userNotFound, wrongPassword } from "../../errors";
import User from "../../db/models/user/user.model";
import {
  asAuthUser,
  getUser,
  getUserByUsername,
  verifyPassword
} from "../../db/user";

// const LocalStrategy = require("passport-local").Strategy;
const { Strategy: LocalStrategy } = PassportLocal;

type RestError = Error & {
  code?: string;
  info?: { [key: string]: string };
};

passport.use(
  // "local-login",
  new LocalStrategy(function(username: string, password: string, done) {
    verifyPassword(username, password).then(ok => {
      if (ok === undefined) {
        const [message, code, info] = userNotFound({ username });
        const error: RestError = new Error(message);
        error.code = code;
        error.info = info;
        done(error);
      } else if (ok) {
        asAuthUser(getUserByUsername(username)).then(user => done(null, user));
      } else {
        const [message, code, info] = wrongPassword({ username });
        const error: RestError = new Error(message);
        error.code = code;
        error.info = info;
        done(error);
      }
    });
  })
);

passport.serializeUser(function(user: User, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id: string, done) {
  const user = await asAuthUser(getUser(id))
    .debug()
    .catch(err => {
      console.error(
        "There was an error accessing the records of" + " user with id: " + id
      );
      return done(err);
    });
  // passport will clear the session if the user is false or null
  // if it is undefined passport will throw an error preventing everything, even login, from working
  return done(null, user || null);
});
