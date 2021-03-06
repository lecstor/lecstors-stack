import * as Knex from "knex";

exports.up = function (knex: Knex) {
  return knex.schema.createTable("emails", (table) => {
    table.uuid("id").primary();
    table.string("email").unique();
    table.boolean("verified").defaultTo(false);
    table
      .uuid("user_id")
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable("emails");
};
