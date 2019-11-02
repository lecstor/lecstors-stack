import * as Knex from "knex";

exports.up = function(knex: Knex): Promise<any> {
  return knex.schema.createTable("email_verification_tokens", table => {
    table.uuid("id").primary();
    table
      .uuid("emailId")
      .references("emails.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("status");
  });
};

exports.down = function(knex: Knex): Promise<any> {
  return knex.schema.dropTable("email_verification_tokens");
};
