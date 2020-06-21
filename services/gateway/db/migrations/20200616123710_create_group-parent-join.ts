import * as Knex from "knex";

exports.up = function (knex: Knex) {
  return knex.schema.createTable("group_parent_join", (table) => {
    table.uuid("id").primary();
    table.uuid("group_id").references("groups.id");
    table.uuid("parent_id").references("groups.id");
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable("group_parent_join");
};
