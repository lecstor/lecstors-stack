import { Config, RecursivePartial } from "./types";

export const config: RecursivePartial<Config> = {
  gateway: {
    url: {
      host: "localhost"
    }
  },
  reactApp: {
    gateway: "external",
    url: {
      host: "localhost"
    }
  }
};
