import User from "../src/models/user/user.model";

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express/index.d.ts
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
  interface Response {
    user?: User;
  }
}
