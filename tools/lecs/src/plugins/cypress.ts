import { Commands } from "makitso";

import { help } from "../utils/help";
import { execute } from "../utils/shell";
import { dockerCompose } from "./docker-compose";

const commands: Commands = {
  cypress: {
    description: "Cypress E2E Testing",
    commands: {
      open: {
        action: async ({ input }) => {
          console.log("open cypress");
          await execute("yarn workspace @lecstor/cypress run open", input.args);
        }
      },
      run: {
        description: "Run Cypress locally (or optionally in Docker)",
        options: ["-d --docker {boolean} - run in Docker"],
        action: async ({ input }) => {
          const { docker } = input.args;
          console.log(`run cypress${docker ? " in docker" : ""}`);
          if (docker) {
            await dockerCompose("up -d cypress");
            await dockerCompose("logs -f --tail=0");
          } else {
            await execute(
              "yarn workspace @lecstor/cypress run run",
              input.args
            );
          }
        },
        help
      }
    }
  }
};

export default function plugin() {
  return { commands };
}
