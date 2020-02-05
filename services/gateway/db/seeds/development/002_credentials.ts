/* eslint-disable @typescript-eslint/camelcase */
import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("credentials")
    .del()
    .then(() =>
      knex("credentials").insert([
        {
          id: "D6708613-207D-4211-A997-E8B588460000",
          userId: "D6708613-207D-4211-A997-E8B588461BB7",
          strategy: "local",
          providerId: "lecstor",
          secret: "$2b$10$S62gHcg9ovzaveNmykI6BOwfR4xaroTtMcueoTbivJ6E6HtnT3QJa"
        }
      ])
    );
}
