'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require('./errors'),
  config = require('../lib/config'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User');

exports.signup = function (req, res) {
  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = 'local';

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } 

    // Remove sensitive data before login
    user.password = undefined;
    user.salt = undefined;

    var token = user.generateJWT();

    res.json({
      'token': 'JWT ' + token,
      user,
    });
  });
};

exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      return res.status(400).send(info);
    } 

    // Remove sensitive data before login
    user.password = undefined;
    user.salt = undefined;

    var token = user.generateJWT();

    res.json({
      'token': 'JWT ' + token,
      user,
    });
  })(req, res, next);
};
