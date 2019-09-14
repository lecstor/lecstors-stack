import passport from "passport";
// import passportFb from "passport-facebook";
// import passportTw from "passport-twitter";
// import { UserInputError } from "apollo-server-express";

// import config from "config";

import User from "../models/user/user.model";

// import useLocalSignup from "./local-signup";
import useLocalLogin from "./local-login";

// useLocalSignup(passport);
useLocalLogin(passport);

// const { Strategy: FbStrategy } = passportFb;
// const { Strategy: TwStrategy } = passportTw;

// const fbConf = config.get("auth.facebook");
// const twConf = config.get("auth.twitter");

//==============================================================================
/**
 *Module variables
 */
// const host = config.get("host");
// const fbAppId = fbConf.appId;
// const fbAppSecret = fbConf.appSecret;
// const fbCallbackURL = fbConf.callbackURL;
// const consumerKey = twConf.consumerKey;
// const consumerSecret = twConf.consumerSecret;
// const twitterCallbackURL = twConf.callbackURL;
//==============================================================================
/**
 *Configuration and Settings
 */
passport.serializeUser(function(user: User, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id: string, done) {
  const user = await User.query()
    .findById(id)
    .catch(err => {
      console.error(
        "There was an error accessing the records of" + " user with id: " + id
      );
      return done(err);
    });
  console.log("deserializeUser", id, user);
  return done(null, user);
});

//==============================================================================
/**
 *Strategies
 */

//---------------------------Facebook Strategy----------------------------------
// passport.use(
//   new FbStrategy(
//     {
//       clientID: fbAppId,
//       clientSecret: fbAppSecret,
//       callbackURL: fbCallbackURL,
//       profileFields: ["id", "displayName", "emails", "photos"],
//       passReqToCallback: true
//     },
//     function(req, accessToken, refreshToken, profile, done) {
//       process.nextTick(function() {
//         if (!req.user) {
//           //confirm that user not loggedin
//           User.findOne({ "social.fb.id": profile.id }, function(err, user) {
//             if (err) {
//               console.error(
//                 "There was an error accessing the dbase",
//                 err.message
//               );
//               return done(err);
//             }
//             if (user) {
//               return done(null, user);
//             } else {
//               const newUser = new User();
//               newUser.social.fb.id = profile.id;
//               newUser.social.fb.token = accessToken;
//               newUser.social.fb.displayName = profile.displayName;
//               newUser.social.fb.email = profile.emails[0].value;
//               newUser.social.fb.photo = profile.photos[0].value || "";
//               newUser.save(function(err) {
//                 if (err) {
//                   console.error(err);
//                   return done(err);
//                 }
//                 return done(null, newUser);
//               });
//             }
//           });
//         } else {
//           //user exists and is loggedin
//           const user = req.user; // pull the user out of the session
//           // update the current users facebook credentials
//           user.social.fb.id = profile.id;
//           user.social.fb.token = accessToken;
//           user.social.fb.displayName = profile.displayName;
//           user.social.fb.email = profile.emails[0].value;
//           user.social.fb.photo = profile.photos[0].value || "";
//           // save modifications to user
//           user.save(function(err) {
//             if (err) {
//               console.error(err);
//               return done(err);
//             }
//             //console.log('user fb', user.social.fb.displayName);
//             //console.log('user fb tokens',user.social.fb.token);
//             return done(null, user);
//           });
//         }
//       });
//     }
//   )
// );
// //---------------------------Twitter Strategy-----------------------------------
// passport.use(
//   new TwStrategy(
//     {
//       consumerKey: consumerKey,
//       consumerSecret: consumerSecret,
//       callbackURL: twitterCallbackURL,
//       profileFields: ["id", "displayName", "username", "photos", "_json"],
//       passReqToCallback: true
//     },
//     function(req, accessToken, tokenSecret, profile, done) {
//       process.nextTick(function() {
//         if (!req.user) {
//           //confirm that user not loggedin
//           User.findOne({ "social.twitter.id": profile.id }, function(
//             err,
//             user
//           ) {
//             if (err) {
//               console.error(
//                 "There was an error accessing the dbase",
//                 err.message
//               );
//               return done(err);
//             }
//             if (user) {
//               return done(null, user);
//             } else {
//               const newUser = new User();
//               newUser.social.twitter.id = profile.id;
//               newUser.social.twitter.token = accessToken;
//               newUser.social.twitter.displayName = profile.displayName;
//               newUser.social.twitter.handle = profile.username;
//               newUser.social.twitter.photo = profile.photos[0].value || "";
//               newUser.social.twitter.metaData.location = profile._json.location;
//               newUser.social.twitter.metaData.description =
//                 profile._json.description;
//               newUser.save(function(err) {
//                 if (err) {
//                   console.error(err);
//                   return done(err);
//                 }
//                 return done(null, newUser);
//               });
//             }
//           });
//         } else {
//           //user exists and is loggedin
//           const user = req.user; // pull the user out of the session
//           // update the current users facebook credentials
//           user.social.twitter.id = profile.id;
//           user.social.twitter.token = accessToken;
//           user.social.twitter.displayName = profile.displayName;
//           user.social.twitter.handle = profile.username;
//           user.social.twitter.photo = profile.photos[0].value || "";
//           user.social.twitter.metaData.location = profile._json.location;
//           user.social.twitter.metaData.description = profile._json.description;
//           // save modifications to user
//           user.save(function(err) {
//             if (err) {
//               console.error(err);
//               return done(err);
//             }
//             return done(null, user);
//           });
//         }
//       });
//     }
//   )
// );

export default passport;
