import { Commands } from "makitso";

import { help } from "../utils/help";
import { execute } from "../utils/shell";

const commands: Commands = {
  config: {
    description: "Stack Config",
    commands: {
      build: {
        description: "Build the config module",
        action: async ({ input }) => {
          await execute(`yarn workspace @lecstor/config run build`, input.args);
        }
      },
      dump: {
        description: "Dump config to the console",
        options: ["-p --prod {boolean} - production config [default false]"],
        action: async ({ input }) => {
          const { prod, ...args } = input.args;
          await execute(
            `${
              prod ? "NODE_ENV=production " : ""
            }yarn workspace @lecstor/config run dump-config`,
            args
          );
        },
        help
      }
    }
  }
};

export default function plugin() {
  return { commands };
}
