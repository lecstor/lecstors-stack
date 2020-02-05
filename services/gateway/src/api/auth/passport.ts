import bcrypt from "bcrypt";
import passport from "passport";
import PassportLocal from "passport-local";
// import { ApolloError } from "apollo-server-express";

import { userNotFound, wrongPassword } from "../../errors";
import User from "../../models/user/user.model";

// const LocalStrategy = require("passport-local").Strategy;
const { Strategy: LocalStrategy } = PassportLocal;

type RestError = Error & {
  code?: string;
  info?: { [key: string]: string };
};

passport.use(
  // "local-login",
  new LocalStrategy(function(username: string, password: string, done) {
    User.findByUsername(username).then(user => {
      if (user) {
        return User.query()
          .findById(user.id)
          .withGraphFetched("credentials")
          .then(withCreds => {
            const creds = withCreds.credentials.find(
              c => c.providerId === username
            );
            return bcrypt
              .compare(password, creds.secret)
              .then(result => {
                if (result) {
                  done(null, user);
                } else {
                  const [message, code, info] = wrongPassword({ username });
                  const error: RestError = new Error(message);
                  error.code = code;
                  error.info = info;
                  done(error);
                }
              })
              .catch(done);
          });
      }
      const [message, code, info] = userNotFound({ username });
      const error: RestError = new Error(message);
      error.code = code;
      error.info = info;
      done(error);
    });
  })
);

passport.serializeUser(function(user: User, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id: string, done) {
  const user = await User.query()
    .findById(id)
    .withGraphFetched("emails")
    .catch(err => {
      console.error(
        "There was an error accessing the records of" + " user with id: " + id
      );
      return done(err);
    });
  return done(null, user);
});
