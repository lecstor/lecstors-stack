import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "umd/react-kit.js",
        format: "umd",
        name: "reactKit",
        esModule: false
      }
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
    input: {
      index: "src/index.ts",
      form: "src/ui/form/index.ts",
      lorem: "src/lorem.tsx"
    },
    output: [
      {
        dir: "esm",
        format: "esm"
      },
      {
        dir: "cjs",
        format: "cjs"
      }
    ],
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
      typescript({
        typescript: require("typescript")
      })
    ]
  }
];
