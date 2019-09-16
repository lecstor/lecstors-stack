// import passportLocal from "passport-local";
import { ApolloError } from "apollo-server-express";

import { userNotFound } from "../errors";

import User from "../models/user/user.model";

import GraphQLLocalStrategy from "./graphql-local-strategy";

// const { Strategy: LocalStrategy } = passportLocal;

export default function useLocalLogin(passport) {
  passport.use(
    "graphql-local-login",
    new GraphQLLocalStrategy((req, username, password, done) => {
      User.findByUsername(username)
        .then(user => {
          if (!user) {
            // return done(null, null, { message: "User does not exist" });
            return done(
              // new UserInputError("User does not exist", { username })
              // userNotFound(new Error("User does not exist"), { username })
              new ApolloError(...userNotFound({ username }))
            );
          }
          console.log("useLocalLogin", user);
          return done(null, user);
        })
        .catch(err => done(err));
    })
  );
}

// passport.use(
//   "local-login",
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       passReqToCallback: true
//     },
//     async function(req, email, password, done) {
//       const user = await User.findByUsername(email).catch(err => {
//         return done(err);
//       });
//       if (!user) {
//         return done(null, false, {
//           message:
//             "User does not exist, please" + ' <a href="/signup">signup</a>'
//         });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: "Invalid password try again" });
//       }
//       return done(null, user);
//     }
//   )
// );
