import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";

import fs from "fs-extra";

// clean up first
try {
  fs.removeSync("./cjs");
  fs.removeSync("./esm");
  // fs.removeSync("./node_modules");
} catch (e) {
  console.log(e.message);
}

const input = {};

const traverseFileSystem = function(currentPath) {
  // console.log(currentPath);
  const files = fs.readdirSync(currentPath);
  for (const i in files) {
    const currentFile = currentPath + "/" + files[i];
    const stats = fs.statSync(currentFile);
    if (stats.isFile()) {
      if (!/\.test\./.test(currentFile)) {
        // not a test file
        const newName = currentFile.replace(/^.*\//, "").replace(/\.tsx?/, "");
        input[newName] = currentFile;
        console.log(newName, currentFile);
      }
    } else if (stats.isDirectory()) {
      traverseFileSystem(currentFile);
    }
  }
};
traverseFileSystem("./src");

console.log({ input });
export default [
  {
    input,
    output: [
      {
        dir: "esm",
        format: "esm"
      }
    ],
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
      typescript({
        typescript: require("typescript")
      })
    ]
  },
  {
    input,
    output: {
      dir: "cjs",
      format: "cjs"
    },
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
      typescript({
        typescript: require("typescript")
      }),
      terser()
    ]
  }
];
