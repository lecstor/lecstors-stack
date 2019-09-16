import * as Knex from "knex";

exports.up = function(knex: Knex): Promise<any> {
  return knex.schema.createTable("users", table => {
    table.uuid("id").primary();
    table.string("firstname");
    table.string("surname");
  });
};

exports.down = function(knex: Knex): Promise<any> {
  return knex.schema.dropTable("users");
};
