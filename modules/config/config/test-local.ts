import { config as base } from "./development";

export const config = {
  ...base,
  knex: {
    connection: { host: "localhost", database: "test" },
    migrations: {
      directory: "../db/migrations",
    },
  },
};
