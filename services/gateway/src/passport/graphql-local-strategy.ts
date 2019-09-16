// https://github.com/jkettmann/graphql-passport

import util from "util";
import passport from "passport-strategy";

function Strategy(verify: Function) {
  if (!verify) {
    throw new TypeError("GraphQLLocalStrategy requires a verify callback");
  }

  passport.Strategy.call(this);
  this.name = "graphql-local";
  this.verify = verify;
}

util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function authenticate(req, options) {
  const { username, password } = options;

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  const verified = (err, user, info) => {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    return self.success(user, info);
  };

  try {
    this.verify(req, username, password, verified);
  } catch (ex) {
    return this.error(ex);
  }
};

export default Strategy;
