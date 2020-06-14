import { Config, RecursivePartial } from "./types";

export const config: RecursivePartial<Config> = {
  materialUi: {
    gateway: "external",
    host: "localhost",
  },
};
