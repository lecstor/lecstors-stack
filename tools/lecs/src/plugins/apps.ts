import fs from "fs";
import { Commands } from "makitso";

import { help } from "../utils/help";
import { execute } from "../utils/shell";

const apps = fs.readdirSync("./apps");

const commands: Commands = {};

apps.forEach(app => {
  if (/^\./.test(app)) return;

  commands[app] = {
    description: `${app}`,
    commands: {
      start: {
        description: `Start ${app}`,
        options: ["-p --prod {boolean} - production config [default false]"],
        action: async ({ input }) => {
          const { prod, ...args } = input.args;
          if (prod) {
            await execute(`yarn workspace @lecstor/${app} run build`, args);
            await execute(`yarn workspace @lecstor/${app} serve-build`, args);
          } else {
            await execute(`yarn workspace @lecstor/${app} start`, args);
          }
        },
        help
      }
    }
  };
});

export default function plugin() {
  return { commands };
}
