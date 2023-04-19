const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "app.bundle.[contenthash].js",
    path: path.resolve(__dirname, "./dist"),
    publicPath: "./",
  },
  mode: "production",
  target: "electron-renderer",
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: require("./webpack.rules"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "LoL Dashboard",
      inject: "body",
      template: "./src/template.html",
    }),
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
};
