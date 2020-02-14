import * as Knex from "knex";

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
    host: string;
    port: number;
    url: {
      internal: string;
      external: string;
    };
  };
  reactApp: {
    gateway: "internal" | "external";
    host: string;
    port: number;
    url: {
      internal: string;
      external: string;
    };
  };
};
