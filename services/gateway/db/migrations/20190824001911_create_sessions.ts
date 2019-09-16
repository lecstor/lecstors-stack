import * as Knex from "knex";

exports.up = function(knex: Knex): Promise<any> {
  return knex.schema.createTable("sessions", table => {
    table.string("id").primary();
    table.json("data");
    table.uuid("userId").references("users.id");
  });
};

exports.down = function(knex: Knex): Promise<any> {
  return knex.schema.dropTable("sessions");
};
