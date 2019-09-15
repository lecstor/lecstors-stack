import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs"
      },
      {
        file: pkg.module,
        format: "es" // the preferred format
      },
      {
        file: "umd/react-kit.js",
        format: "umd",
        name: "reactKit",
        esModule: false
      }
      // {
      //   input: "src/main.js",
      //   output: {
      //     file: "esm/index.js",
      //     format: "esm"
      //   }
      // }
      // {
      //   file: pkg.browser,
      //   format: "iife",
      //   name: "MyPackage" // the global which can be used in a browser
      // }
    ],
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
      typescript({
        typescript: require("typescript")
      }),
      terser() // minifies generated bundles
    ]
  },
  {
    input: "src/index.ts",
    output: {
      file: "esm/index.js",
      format: "esm"
    }, // {
    //   file: pkg.browser,
    //   format: "iife",
    //   name: "MyPackage" // the global which can be used in a browser
    // }
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
      typescript({
        typescript: require("typescript")
      })
    ]
  }
];
