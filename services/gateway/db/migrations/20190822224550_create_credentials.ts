import * as Knex from "knex";

exports.up = function(knex: Knex): Promise<any> {
  return knex.schema.createTable("credentials", table => {
    table.uuid("id").primary();

    table.string("providerId").unique(); // provider id/username/token
    table.string("secret"); // password/2fa secret
    table.uuid("userId").references("users.id");
    table.string("strategy"); // "local" | "fb" | "tw"
    table.unique(["userId", "strategy"]);

    /*
    In theory this would be better, but it's just a pita if you want to be
    able to easily and repeatedly wipe the db. (can be sorted but requires
    mode code)
    table.enum("strategy", ["local", "fb", "tw"], {
      useNative: true,
      enumName: "strategy_type",
      existingType: false
    });
    */
  });
};

exports.down = async function(knex: Knex): Promise<any> {
  // await knex.schema.raw(`
  //   ALTER TABLE "credentials" DROP CONSTRAINT "strategy_type";
  // `);
  return knex.schema.dropTable("credentials");
};
