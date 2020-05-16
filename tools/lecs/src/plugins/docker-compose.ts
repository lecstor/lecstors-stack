import { help } from "../utils/help";
import { execute, ExecOptions } from "../utils/shell";
import { getApps, getServices } from "../utils/suggest";
import { Commands } from "makitso";

export function dockerCompose(
  command: string,
  options: ExecOptions & { prod?: boolean; test?: boolean } = {}
) {
  const { prod = false, test = false, ...execOptions } = options;
  const mode = prod ? "prod" : "dev";
  const buildEnv = prod ? "production" : "development";
  const nodeEnv = test ? "test" : buildEnv;

  const cmd = `COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \
  COMPOSE_FILE=docker-compose.yml:docker-compose.${mode}.yml \
  BUILD_ENV="${buildEnv}" NODE_ENV=${nodeEnv}  TAG=${buildEnv}-${nodeEnv} \
  docker-compose ${command}`;

  console.log(cmd);
  return execute(cmd, execOptions);
}

function argIsArray(arg: string | string[]): arg is string[] {
  return typeof arg === "object";
}

function argToString(arg: string | string[]) {
  return argIsArray(arg) ? arg.join(" ") : arg;
}

const commands: Commands = {
  dc: {
    description: "Docker Compose",
    commands: {
      build: {
        description: "Build or rebuild services",
        options: ["-p --prod {boolean} - production build [default false]"],
        arguments: ["[services...] - services to build"],
        action: async ({ input }) => {
          const { services, ...args } = input.args;
          await dockerCompose(`build ${argToString(services)}`, {
            ...args,
            rejectCode: false
          });
        },
        help
      },
      ps: {
        description: "List containers",
        options: ["-p --prod {boolean} - production build [default false]"],
        action: async ({ input }) => {
          await dockerCompose("ps", { ...input.args, rejectCode: false });
        },
        help
      },
      up: {
        description: "Create and start containers",
        arguments: ["[services...] - services to bring up"],
        options: [
          "-b --build {boolean} - Build images before starting containers.",
          "-l --logs {boolean} - tail the logs (default: false)",
          "-o --removeOrphans{boolean}  - Remove containers for services not defined in the Compose file.",
          "-p --prod {boolean} - production build",
          "-r --forceRecreate {boolean} - Recreate containers even if their configuration and image haven't changed.",
          "-t --test {boolean} - run in test environment"
        ],
        action: async ({ input }) => {
          const {
            forceRecreate,
            removeOrphans,
            logs,
            services,
            ...args
          } = input.args;
          console.log({ services, str: argToString(services) });
          await dockerCompose(
            `up -d${forceRecreate ? " --force-recreate" : ""}${
              removeOrphans ? " --remove-orphans" : ""
            } ${argToString(services)}`,
            {
              ...args,
              rejectCode: false
            }
          );
          if (logs) {
            await dockerCompose("logs -f --tail=0", {
              ...args,
              rejectCode: false
            });
          }
        },
        suggest: async () => {
          return [...getApps(), ...getServices()];
        },
        help
      },
      down: {
        description: "Bring down the docker stack",
        action: async ({ input }) => {
          await dockerCompose(`down`, { ...input.args, rejectCode: false });
        },
        help
      },
      logs: {
        description: "View container logs",
        arguments: ["[services...] - services to log"],
        action: async ({ input }) => {
          const { services, ...args } = input.args;
          await dockerCompose("logs -f --tail=0", {
            ...args,
            rejectCode: false
          });
        },
        help
      },
      stop: {
        description: "Stop containers",
        arguments: ["[services...] - services to stop"],
        action: async ({ input }) => {
          const { services, ...args } = input.args;
          await dockerCompose(`stop ${argToString(services)}`, {
            ...args,
            rejectCode: false
          });
        },
        help
      },
      restart: {
        description: "Restart services",
        arguments: ["[services...] - services to restart"],
        options: [
          "-h --hard {boolean} - stop service/s and then bring it/them back up (default: false)",
          "-l --logs {boolean} - tail the logs (default: false)"
        ],
        action: async ({ input }) => {
          const { hard, logs, services: servicesArray, ...args } = input.args;
          const services = argToString(servicesArray);
          if (hard) {
            await dockerCompose(`stop ${services}`, {
              ...args,
              rejectCode: false
            });
            await dockerCompose(`up ${services}`, {
              ...args,
              rejectCode: false
            });
          } else {
            await dockerCompose(`restart ${services}`, {
              ...args,
              rejectCode: false
            });
          }
          if (logs) {
            await dockerCompose(`logs -f --tail=0 ${services}`, {
              ...args,
              rejectCode: false
            });
          }
        },
        help
      },
      update: {
        description: "Pull service images",
        options: ["-l --logs {boolean} - tail the logs (default: false)"],
        action: async ({ input }) => {
          const { logs, ...args } = input.args;
          await dockerCompose("pull --ignore-pull-failures", {
            ...args,
            rejectCode: false
          });
          await dockerCompose("up -d --force-recreate", {
            ...args,
            rejectCode: false
          });
          if (logs) {
            await dockerCompose("logs -f --tail=0", {
              ...args,
              rejectCode: false
            });
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
