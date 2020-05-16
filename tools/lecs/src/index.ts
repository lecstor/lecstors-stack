#!/usr/bin/env node

import { Makitso } from "makitso";
import Apps from "./plugins/apps";
import Config from "./plugins/config";
import Cypress from "./plugins/cypress";
import DockerCompose from "./plugins/docker-compose";
import Kubernetes from "./plugins/kubernetes";

let cmdLine;
if (process.argv.length > 2) {
  cmdLine = process.argv.slice(2).join(" ");
}

Makitso({
  plugins: [Apps(), Config(), Cypress(), DockerCompose(), Kubernetes()],
  commandPrompt: "lecs> ",
  cmdLine
}).catch(console.error);
