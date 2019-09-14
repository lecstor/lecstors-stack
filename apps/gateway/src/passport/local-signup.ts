// import passportLocal from "passport-local";

// import User from "../models/user/user.model";

// const { Strategy: LocalStrategy } = passportLocal;

// function createUser(username, password, email) {
//   return User.query()
//     .allowInsert("[credentials, emails]")
//     .insertGraph({
//       credentials: [
//         {
//           strategy: "local",
//           providerId: username,
//           secret: password
//         }
//       ],
//       emails: [{ email }]
//     });
// }

// export default function useLocalSignup(passport) {
//   passport.use(
//     "local-signup",
//     new LocalStrategy(
//       {
//         usernameField: "email",
//         passwordField: "password",
//         passReqToCallback: true
//       },
//       async function(req, email, password, done) {
//         if (req.user) {
//           // ignore for now
//           return done(null, req.user);

//           //user exists and is loggedin
//           // const user = req.user; // pull the user out of the session
//           // // update the current users local credentials
//           // user.local.username = req.body.username;
//           // user.local.email = email;
//           // user.local.password = user.generateHash(password);
//           // // save modifications to user
//           // user.save(function(err) {
//           //   if (err) {
//           //     console.error(err);
//           //     return done(err);
//           //   }
//           //   return done(null, user);
//           // });
//         }

//         const user = await User.findByUsername(email).catch(err => {
//           console.error(err);
//           return done(err);
//         });

//         if (user) {
//           return done(null, false, { message: "email already exists" });
//         }

//         const { username } = req.body;
//         const newUser = await createUser(username, password, email).catch(
//           err => {
//             if (err.message == "User validation failed") {
//               return done(null, false, {
//                 message: "Please fill all fields"
//               });
//             }
//             console.error(err);
//             return done(err);
//           }
//         );

//         return done(null, newUser);
//       }
//     )
//   );
// }
