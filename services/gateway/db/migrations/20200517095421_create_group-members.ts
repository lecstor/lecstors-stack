import * as Knex from "knex";

exports.up = function (knex: Knex) {
  return knex.schema.createTable("group_members", (table) => {
    table.uuid("id").primary();
    table.uuid("group_id").references("groups.id").onDelete("CASCADE");
    table.uuid("user_id").references("users.id").onDelete("CASCADE");
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable("group_members");
};
