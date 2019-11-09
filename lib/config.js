'use strict';

/**
 * Module dependencies.
 */
var pathUtil = require('../utils/path');


/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
   
  // Set config files
  var config = {
    app: {
      title: 'Sample Task REST API',
      version: '1.0.0',
      description: 'A solution to the problem provided by Sample'
    },
    port: 3000,
    db: {
      uri: 'postgres://postgres:P@ssword123@localhost:5432/postgres',
      // uri: 'mongodb://mongo:27017/sample-db',
      //uri: 'mongodb://localhost:27017/sample-db',
      host: 'localhost',
      database: 'sample-db',
      username: '',
      password: '',
      debug: false
    },
    tokenSecret: process.env.TOKEN_SECRET || 'sEcReT',
    tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || 5356800, // in seconds
  };

  config.files = {};
  // Setting Globbed route files
  config.files.routes = pathUtil.getGlobbedPaths(['routes/**/*.js']);
  config.files.handlers = pathUtil.getGlobbedPaths(['handlers/**/*.js']);
  config.files.models = pathUtil.getGlobbedPaths(['models/**/*.js']);

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
