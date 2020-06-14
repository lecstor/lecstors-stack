#!/usr/bin/env node

import { Makitso } from "makitso";
import Apps from "./plugins/apps";
import Config from "./plugins/config";
import Db from "./plugins/db";
import Cypress from "./plugins/cypress";
import DockerCompose from "./plugins/docker-compose";
import Kubernetes from "./plugins/kubernetes";
import Services from "./plugins/services";

let cmdLine;
if (process.argv.length > 2) {
  cmdLine = process.argv.slice(2).join(" ");
}

Makitso({
  plugins: [
    Apps(),
    Config(),
    Cypress(),
    Db(),
    DockerCompose(),
    Kubernetes(),
    Services(),
  ],
  commandPrompt: "lecs> ",
  cmdLine,
}).catch(console.error);
