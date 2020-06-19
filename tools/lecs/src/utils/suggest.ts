import fs from "fs";

export const getApps = () =>
  fs.readdirSync("./apps").filter((f) => !/^\./.test(f));

export const getServices = () =>
  fs.readdirSync("./services").filter((f) => !/^\./.test(f));
