import * as Knex from "knex";

exports.up = function (knex: Knex) {
  return knex.schema.createTable("group_parent_join", (table) => {
    table.uuid("id").primary();
    table.uuid("groupId").references("groups.id");
    table.uuid("parentId").references("groups.id");
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable("group_parent_join");
};
