import * as Knex from "knex";

exports.up = function(knex: Knex): Promise<any> {
  return knex.schema.createTable("credentials", table => {
    table.uuid("id").primary();
    table.enum("strategy", ["local", "fb", "tw"], {
      useNative: true,
      enumName: "strategy_type",
      existingType: true
    });
    table.string("providerId").unique(); // provider id/username/token
    table.string("secret"); // password/2fa secret
    table.uuid("userId").references("users.id");
    table.unique(["userId", "strategy"]);
  });
};

exports.down = async function(knex: Knex): Promise<any> {
  await knex.schema.raw(`
    ALTER TABLE "credentials" DROP CONSTRAINT "strategy_type";
  `);
  return knex.schema.dropTable("credentials");
};
