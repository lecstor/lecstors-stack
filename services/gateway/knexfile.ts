import Knex from "knex";

import config from "config";

const knexConfig: Knex.Config = config.get("knex");

console.log(knexConfig);

module.exports = knexConfig;

// export default knexConfig;

// export const config = {
//   docker: {
//     client: "postgresql",
//     connection: {
//       host: "postgres",
//       database: "lecstor",
//       user: "lecstor",
//       password: "fooBar"
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       directory: __dirname + "/db/migrations",
//       tableName: "knex_migrations"
//     },
//     seeds: {
//       directory: __dirname + "/db/seeds/development"
//     }
//   },

//   development: {
//     client: "postgresql",
//     connection: {
//       host: "postgres",
//       database: "lecstor",
//       user: "lecstor",
//       password: "fooBar"
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       directory: __dirname + "/db/migrations",
//       tableName: "knex_migrations"
//     },
//     seeds: {
//       directory: __dirname + "/db/seeds/development"
//     }
//   },

//   test: {
//     client: "postgresql",
//     connection: {
//       database: "lecstor",
//       user: "lecstor",
//       password: "fooBar"
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       directory: __dirname + "/db/migrations",
//       tableName: "knex_migrations"
//     },
//     seeds: {
//       directory: __dirname + "/db/seeds/test"
//     }
//   },

//   production: {
//     client: "postgresql",
//     connection: {
//       database: "lecstor",
//       user: "lecstor",
//       password: "fooBar"
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       directory: __dirname + "/db/migrations",
//       tableName: "knex_migrations"
//     },
//     seeds: {
//       directory: __dirname + "/db/seeds/production"
//     }
//   }
// };
