module.exports = api => {
  api.cache(true);
  return {
    env: {
      "test": {
        // sourceMaps: "inline",
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
          '@babel/preset-react',
        ],
      },
      "e2e": {
        // sourceMaps: "inline",
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
          '@babel/preset-react',
        ],
        plugins: [
          [
            "istanbul",
            {
              exclude: ["**/*.test.tsx"]
              // include: ["**/*.js", "**/*.ts", "**/*.tsx"],
            }
          ]
        ]
      }
    },
    presets: [
      "@babel/preset-typescript",
      [
        "@babel/preset-env",
        {
          useBuiltIns: "entry",
          targets: "> 0.25%, not dead",
          modules: false,
          corejs: 3
        }
      ],
      "@babel/preset-react"
    ],
    plugins: [
      "react-hot-loader/babel",
      "@loadable/babel-plugin",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining"
    ]
  
  };
};
