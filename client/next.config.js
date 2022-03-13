module.exports = {
  webpackDevMiddleware: (config) => {
    webpack5: false
    config.watchOptions.poll = 300;
    return config;
  }
};
