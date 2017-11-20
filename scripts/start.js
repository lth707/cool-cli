'use strict';

const chalk = require('chalk');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const mock = require('../utils/mock');
const webpackConfig = require('../config/devConfig');

const devServerConfig = webpackConfig.devServer;

function compile() {
  let compiler;
  try {
    compiler = webpack(webpackConfig);
  } catch (err) {
    console.log(chalk.red('Failed to initialize compile.'));
    console.log(err.message || err);
    process.exit(1);
  }

  compiler.plugin('done', stats => {
    const messages = formatWebpackMessages(stats.toJson({}, true));

    if (!messages.errors.length && !messages.warnings.length) {
      console.log(chalk.green('Compile finished successfully!'));
    } else if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'));
      messages.errors.forEach(message => {
        console.log(message);
      });
    }
  });
  return compiler;
}

function run() {
  const compiler = compile();
  const devServer = new WebpackDevServer(compiler, devServerConfig);

  mock(devServer);

  devServer.listen(devServerConfig.port, devServerConfig.host, err => {
    if (err) {
      return console.log(chalk.red(err));
    }
    console.log(
      `The app is running at: ${chalk.cyan(
        `http://${devServerConfig.host}:${devServerConfig.port}/`
      )}`
    );
  });
}

run();
