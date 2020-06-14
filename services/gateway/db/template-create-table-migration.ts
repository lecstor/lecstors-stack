import * as Knex from "knex";

exports.up = function(knex: Knex) {
  return knex.schema.createTable("tableName", table => {
    table.uuid("id").primary();

    // table.string("columnName");
    // table.boolean("columnName").defaultTo(false);
    // table.json("columnName");

    // table.string("columnName").unique();

    // table.unique(["columnName1", "columnName2"]);

    // table
    //   .uuid("columnName")
    //   .references("tableName.columnName")
    //   .onUpdate("CASCADE")
    //   .onDelete("CASCADE");
  });
};

exports.down = function(knex: Knex) {
  return knex.schema.dropTable("tableName");
};
