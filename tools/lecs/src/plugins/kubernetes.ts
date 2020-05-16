import { Commands } from "makitso";

import { help } from "../utils/help";
import { execute } from "../utils/shell";

const commands: Commands = {
  kubernetes: {
    description: "Kubernetes",
    commands: {
      apply: {
        description: "Apply generated config to a namespace",
        arguments: ["namespace - the namespace to apply config to"],
        action: async ({ input }) => {
          await execute(
            `kubectl apply -n "${input.args.namespace}" -R -f kubernetes/production`,
            input.args
          );
        }
      },
      create: {
        commands: {
          namespace: {
            description: "Create a namespace in Kubernetes",
            arguments: ["namespace - the namespace to create"],
            action: async ({ input }) => {
              await execute(
                `kubectl create namespace "${input.args.namespace}"`,
                input.args
              );
            },
            help
          }
        }
      },
      generate: {
        description: "Generate config using Kompose",
        action: async ({ input }) => {
          await execute(
            "BUILD_ENV=production TAG=production kompose convert -o kubernetes/production/kompose",
            input.args
          );
        }
      }
    }
  }
};

export default function plugin() {
  return { commands };
}
