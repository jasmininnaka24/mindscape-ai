const path = require('path');

module.exports = function override(config, env) {
  // Add the necessary fallback for the 'path' module
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "path": require.resolve("path-browserify")
  };

  return config;
};
