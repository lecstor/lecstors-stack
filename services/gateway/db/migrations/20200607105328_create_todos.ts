import * as Knex from "knex";

exports.up = function (knex: Knex) {
  return knex.schema.createTable("todos", (table) => {
    table.uuid("id").primary();
    table.string("name");
    table.string("description");
    table.uuid("group_id").references("groups.id").onDelete("CASCADE");
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable("todos");
};
