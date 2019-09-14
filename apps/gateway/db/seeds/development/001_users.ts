/* eslint-disable @typescript-eslint/camelcase */
import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(() =>
      knex("users").insert([
        {
          id: "D6708613-207D-4211-A997-E8B588461BB7",
          firstname: "Jason",
          surname: "Galea"
        }
      ])
    );
}
