import * as Knex from "knex";

exports.up = function (knex: Knex) {
  return knex.schema.createTable("groups", (table) => {
    table.uuid("id").primary();
    table.string("name");
    table.string("description");
    table.string("type");
    table.boolean("is_primary").defaultTo(false);
    table.uuid("primary_group_id").references("groups.id").onDelete("CASCADE");
    table.specificType("privileges", "bit varying(32)");
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable("groups");
};
