import { RecursivePartial } from "copin";
import { Config } from "./types";

const config: RecursivePartial<Config> = {
  knex: {
    // database connection
    client: "postgresql",
    connection: {
      host: "DB_HOST",
    },
  },
};

export { config };
