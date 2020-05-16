import { Config, RecursivePartial } from "./types";

export const config: RecursivePartial<Config> = {
  knex: {
    // database connection
    client: "postgresql",
    connection: {
      database: "lecstor_prod",
      user: "lecstor_prod",
      password: "fooBar_prod"
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  notifications: {
    sendEmailVerification: true
  },
  gateway: {
    cors: {
      origin: ["http://ezyapp.com"]
    },
    graphql: {
      debug: false
    },
    session: {
      secret: "duhenfyt48vbfelsdokjrw93",
      secure: true
    },
    url: {
      internal: "http://gateway:3000"
    }
  },
  reactApp: {
    gateway: "internal",
    host: "0.0.0.0",
    port: 4321,
    url: {
      external: "http://ezyapp.com"
    }
  }
};
