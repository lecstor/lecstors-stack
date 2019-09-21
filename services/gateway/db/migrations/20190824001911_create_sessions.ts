import * as Knex from "knex";

exports.up = function(knex: Knex): Promise<any> {
  return knex.schema.createTable("sessions", table => {
    table.string("id").primary();
    table.json("data");
  });
};

exports.down = function(knex: Knex): Promise<any> {
  return knex.schema.dropTable("sessions");
};
