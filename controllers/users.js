'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require('./errors'),
  config = require('../lib/config'),
  sequelize = require('sequelize'),
  passport = require('passport'),
  bcrypt = require('bcrypt'),
  User = sequelize.model('User');

exports.signup = function (req, res) {

  var username = req.body.username,
    password = req.body.password,
    email = req.body.email;

  bcrypt.hash(password, 16, (err, hashedPassword) => {
    if (err) {
      console.error('Error: ', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    User.create({
      email,
      username,
      password: hashedPassword,
    }).then(user => {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
  
      var token = User.generateJWT(user);
  
      res.json({
        'token': 'JWT ' + token,
        user,
      });
    }).catch(err => {
      console.error('Error: ', err);
      res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  });
};

exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      console.error('Error: ', err);
      return res.status(400).send(info);
    } 

    // Remove sensitive data before login
    user.password = undefined;
    user.salt = undefined;

    var token = User.generateJWT(user);

    res.json({
      'token': 'JWT ' + token,
      user,
    });
  })(req, res, next);
};
