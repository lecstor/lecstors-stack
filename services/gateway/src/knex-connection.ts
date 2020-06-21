import Knex from "knex";
import { knexSnakeCaseMappers } from "objection";
import config from "@lecstor/config";

const knexConfig = config.knex;

const connectConfig: Knex.Config = {
  ...knexConfig,
  migrations: {
    ...knexConfig.migrations,
    directory: `${__dirname}/${knexConfig.migrations?.directory}`,
  },
  seeds: {
    ...knexConfig.seeds,
    directory: `${__dirname}/${knexConfig.seeds?.directory}`,
  },

  ...knexSnakeCaseMappers(),
};

const knexConnection = Knex(connectConfig);

export default knexConnection;
