// eslint-disable-next-line @typescript-eslint/no-var-requires
const kebabCase = require("lodash.kebabcase");

module.exports = api => {
  api.cache(true);
  return {
    presets: [
      "@babel/preset-typescript",
      [
        "@babel/preset-env",
        {
          useBuiltIns: "entry",
          targets: "> 0.25%, not dead",
          modules: false
        }
      ],
      "@babel/preset-react"
    ],
    plugins: [
      [
        "transform-imports",
        {
          "@lecstor/react-ui": {
            transform: importName => {
              return `@lecstor/react-ui/esm/${kebabCase(importName)}`;
            },
            preventFullImport: false
          }
        }
      ],
      "react-hot-loader/babel",
      "@loadable/babel-plugin"
    ]
  };
};
