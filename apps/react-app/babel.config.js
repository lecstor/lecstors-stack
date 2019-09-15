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
          "@lecstor/react-kit/(.*)": {
            transform: (importName, matches) => {
              console.log({ importName, matches });
              return `@lecstor/react-kit/${matches[1]}/${kebabCase(
                importName
              )}`;
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
