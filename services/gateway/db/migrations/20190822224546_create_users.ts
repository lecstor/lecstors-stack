import * as Knex from "knex";

exports.up = function(knex: Knex) {
  return knex.schema.createTable("users", table => {
    table.uuid("id").primary();
    table.string("firstname");
    table.string("surname");
  });
};

exports.down = function(knex: Knex) {
  return knex.schema.dropTable("users");
};
