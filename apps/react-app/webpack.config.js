const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

const devConfig = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    hot: true,
    historyApiFallback: true,
    allowedHosts: ["react-app"]
  }
};

module.exports = env => {
  return {
    mode: "production",
    entry: "./src/index.tsx",
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve("babel-loader"),
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        }
      ]
    },
    resolve: {
      alias: {
        "react-dom": "@hot-loader/react-dom"
      },
      extensions: ["*", ".mjs", ".ts", ".tsx", ".js"],
      plugins: [PnpWebpackPlugin]
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)]
    },
    output: {
      path: __dirname + "/dist",
      publicPath: "/",
      filename: "[name].bundle.js"
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: "src/index.ejs"
      })
    ],
    ...(env && env.production ? {} : devConfig)
  };
};
