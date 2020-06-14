import fs from "fs";
import { Commands } from "makitso";

import { help } from "../utils/help";
import { execute } from "../utils/shell";

const apps = fs.readdirSync("./apps");

const commands: Commands = {};

apps.forEach((app) => {
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
        help,
      },
      test: {
        description: `Test ${app}`,
        options: [
          "-c --coverage {boolean} - generate a coverage report [default false]",
        ],
        action: async ({ input }) => {
          const { coverage, ...args } = input.args;
          await execute(
            `DB_HOST=localhost yarn workspace @lecstor/${app} run test ${
              coverage ? "--coverage" : ""
            }`,
            args
          );
        },
        help,
      },
      cypress: {
        description: "Cypress E2E Testing",
        commands: {
          open: {
            description: `open Cypress for ${app}`,
            action: async ({ input }) => {
              console.log("open Cypress");
              await execute(
                `yarn workspace @lecstor/cypress run open --project ../../apps/${app}`,
                input.args
              );
            },
          },
          run: {
            description: `run Cypress for ${app}`,
            action: async ({ input }) => {
              await execute(
                `yarn workspace @lecstor/cypress run run --project ../../apps/${app}`,
                input.args
              );
            },
            help,
          },
          // run: {
          //   description: "Run Cypress locally (or optionally in Docker)",
          //   options: ["-d --docker {boolean} - run in Docker"],
          //   action: async ({ input }) => {
          //     const { docker } = input.args;
          //     console.log(`run cypress${docker ? " in docker" : ""}`);
          //     if (docker) {
          //       await dockerCompose("up -d cypress");
          //       await dockerCompose("logs -f --tail=0");
          //     } else {
          //       await execute(
          //         "yarn workspace @lecstor/cypress run run",
          //         input.args
          //       );
          //     }
          //   },
          //   help
          // }
        },
      },
    },
  };
});

export default function plugin() {
  return { commands };
}
