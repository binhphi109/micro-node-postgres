'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require('./errors'),
  config = require('../lib/config'),
  sequelize = require('sequelize'),
  passport = require('passport'),
  crypto = require('crypto'),
  User = sequelize.model('User');

exports.signup = function (req, res) {

  var username = req.body.username,
    password = req.body.password,
    email = req.body.email,
    salt = crypto.randomBytes(16).toString('base64'),
    created = Date.now();

  var hashedPassword = User.hashPassword(password, salt);

  User.create({
    email,
    username,
    password: hashedPassword,
    salt,
    created,
  }).then(user => {
    // Remove sensitive data before login
    user.password = undefined;
    user.salt = undefined;

    var token = user.generateJWT();

    res.json({
      'token': 'JWT ' + token,
      user,
    });
  }).catch(err => {
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
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
