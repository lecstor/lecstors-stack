import { Config } from "./types";

export const config: Config = {
  auth: {
    facebook: {
      appId: "",
      appSecret: "",
      callbackUrl: ""
    },
    twitter: {
      consumerKey: "",
      consumerSecret: "",
      callbackUrl: ""
    }
  },
  knex: {
    // database connection
    client: "postgresql",
    connection: {
      host: "postgres",
      database: "lecstor",
      user: "lecstor",
      password: "fooBar"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "db/migrations",
      tableName: "knex_migrations"
    },
    seeds: {
      directory: "db/seeds/development"
    }
  },
  notifications: {
    sendEmailVerification: false,
    sendgrid: {
      apiKey: ""
    }
  },
  gateway: {
    cors: {
      origin: ["http://localhost:4321", "http://react-app:4321"],
      credentials: true
    },
    graphql: {
      cors: false,
      debug: true,
      path: "/graphql"
    },
    session: {
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true
      },
      resave: false,
      saveUninitialized: false,
      secret: "cnjdubvksmfgsdfvfvdfgw",
      secure: false
    },
    trustProxy: 1, // https://expressjs.com/en/guide/behind-proxies.html
    host: "gateway",
    port: 3000,
    url: {
      internal: "http://gateway:3000",
      external: "http://localhost:3000"
    }
  },
  reactApp: {
    gateway: "internal",
    host: "0.0.0.0",
    port: 4321,
    url: {
      external: "http://localhost:4321",
      internal: "http://react-app:4321"
    }
  }
};
