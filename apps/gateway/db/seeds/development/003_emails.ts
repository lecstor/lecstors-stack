/* eslint-disable @typescript-eslint/camelcase */
import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("emails")
    .del()
    .then(() =>
      knex("emails").insert([
        {
          id: "D6708613-207D-4211-A997-E8B588461BB7",
          email: "jason@lecstor.com",
          verified: true,
          userId: "D6708613-207D-4211-A997-E8B588461BB7"
        }
      ])
    );
}
