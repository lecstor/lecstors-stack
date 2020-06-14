import { Commands } from "makitso";

import { help } from "../utils/help";
import { execute } from "../utils/shell";

const commands: Commands = {
  db: {
    description: "Database management",
    commands: {
      create: {
        description: "Create something",
        commands: {
          table: {
            description: "Create a create table migration",
            arguments: ["name - the name of the table"],
            action: async ({ input }) => {
              const result = await execute(
                `yarn workspace @lecstor/gateway run db:make-migration create_${input.args.name}`,
                input.args
              );
              if (typeof result === "string") {
                const lines = result.split(/\n/);
                const last = lines[lines.length - 2];
                const file = last.match(/Created Migration: (.+)/)[1];
                const pathToDb = file.match(/(.+\/db)\//)[1];
                await execute(
                  `cp  ${pathToDb}/template-create-table-migration.ts ${file}`,
                  input.args
                );
                await execute(`open ${file}`, input.args);
              }
            },
            help,
          },
        },
      },
      // COPIN_CONFIG=local-db yarn workspace @lecstor/gateway db:migrate
      // COPIN_CONFIG=local-db yarn workspace @lecstor/gateway db:migrate-rollback
    },
  },
};

export default function plugin() {
  return { commands };
}
