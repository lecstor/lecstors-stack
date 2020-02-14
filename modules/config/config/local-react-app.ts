import { Config, RecursivePartial } from "./types";

export const config: RecursivePartial<Config> = {
  reactApp: {
    gateway: "external",
    host: "localhost"
  }
};
