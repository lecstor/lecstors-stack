import { config as base } from "./development";

export const config = {
  ...base,
  knex: {
    connection: { host: "localhost" },
    migrations: {
      directory: "./db/migrations",
    },
  },
};
