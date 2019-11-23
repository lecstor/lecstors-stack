const path = require('path');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

// module.exports = async ({ config }) => {
//   config.module.rules.push({
//     test: /\.(stories|story)\.([tj]sx?|mdx)$/,
//     use: [
//       {
//         loader: require.resolve('babel-loader'),
//         // may or may not need this line depending on your app's setup
//         options: {
//           plugins: ['@babel/plugin-transform-react-jsx'],
//         }
//       },
//       {
//         loader: '@mdx-js/loader',
//         options: {
//           compilers: [createCompiler({})],
//         },
//       },
//     ],
//   });

//   config.module.rules.push({
//     test: /\.(stories|story)\.[tj]sx?$/,
//     use: {
//       loader: require.resolve('@storybook/source-loader'),
//       options: {
//       exclude: [/node_modules/],
//       enforce: 'pre'
//     }}
//   });
  
//   return config;
// };

module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('react-docgen-typescript-loader'),
      },
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [['react-app', { flow: false, typescript: true }]],
        },
      },
    ]
  });

  config.module.rules.push({
    test: /\.(stories|story)\.(ts|tsx)$/,
    exclude: path.resolve(__dirname, '../node_modules/'),
    use: [
      {
        loader: require.resolve('@storybook/source-loader'),
      },
    ],
  });

  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
