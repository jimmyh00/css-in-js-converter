const path = require('path')

module.exports = {
  target: 'node', // VSCode插件运行在Node.js环境中
  entry: './src/extension.ts', // 插件的入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2', // 插件使用CommonJS模块系统
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode', // “vscode”模块由VSCode运行时提供
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      json5: path.resolve(__dirname, 'node_modules/json5/dist/index.js'),
      // ... other aliases ...
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
}
