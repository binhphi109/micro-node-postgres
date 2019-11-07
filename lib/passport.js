'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  config = require('./config');

/**
 * Module init function.
 */
module.exports = function (app) {
  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());

  // Deserialize user from token
  app.use(function (req, res, next) {
    // Check if request is authenticated
    if (req.headers.authorization) {
      passport.authenticate('jwt', function (err, user, info) {
        // Attach user to request
        if (user) {
          req.user = user;
        }
        next();
      })(req, res, next);
    } else {
      next();
    }
  });
};
