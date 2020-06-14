import fs from "fs";
import { Commands } from "makitso";

import { help } from "../utils/help";
import { execute, executeSync } from "../utils/shell";

const services = fs.readdirSync("./services");

const commands: Commands = {};

services.forEach(service => {
  if (/^\./.test(service)) return;

  commands[service] = {
    description: `${service}`,
    commands: {
      start: {
        description: `Start ${service}`,
        options: ["-p --prod {boolean} - production config [default false]"],
        action: async ({ input }) => {
          const { prod, ...args } = input.args;
          if (prod) {
            await execute(`yarn workspace @lecstor/${service} run build`, args);
            await execute(
              `yarn workspace @lecstor/${service} start:local:dist`,
              args
            );
          } else {
            await execute(`yarn workspace @lecstor/${service} start`, args);
          }
        },
        help
      },
      test: {
        description: `Test ${service}`,
        options: [
          "-c --coverage {boolean} - generate a coverage report [default false]"
        ],
        action: async ({ input }) => {
          const { coverage } = input.args;
          executeSync(
            `yarn workspace @lecstor/${service} run test ${
              coverage ? "--coverage" : ""
            }`
          );
        },
        help
      }
    }
  };
});

export default function plugin() {
  return { commands };
}
