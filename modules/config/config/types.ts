import * as Knex from "knex";

type Url = {
  scheme: string;
  port: number;
  host: string;
};

type UrlConfig = Url & {
  internal: Url;
  external: Url;
};

export { RecursivePartial } from "../index";

export type Config = {
  auth: {
    facebook: {
      appId: string;
      appSecret: string;
      callbackUrl: string;
    };
    twitter: {
      consumerKey: string;
      consumerSecret: string;
      callbackUrl: string;
    };
  };
  knex: Knex.Config;
  notifications: {
    sendgrid: {
      apiKey: string;
    };
    sendEmailVerification: boolean;
  };
  gateway: {
    cors: {
      origin: string | string[];
      credentials: boolean;
    };
    graphql: {
      cors: boolean;
      debug: boolean;
      path: string;
    };
    session: {
      cookie: {
        maxAge: number;
        httpOnly: boolean;
      };
      resave: boolean;
      saveUninitialized: boolean;
      secret: string;
      secure: boolean;
    };
    trustProxy: boolean | string | string[] | number;
    url: UrlConfig;
  };
  reactApp: {
    gateway: string;
    url: UrlConfig;
  };
};
