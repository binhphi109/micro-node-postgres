'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  User = require('mongoose').model('User'),
  config = require('../config');

module.exports = function () {
  // Use jwt strategy
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.tokenSecret,
    algorithms: config.tokenAlgorithms,
  }, 
  function (jwt_payload, done) {
    User.findOne({
      _id: jwt_payload._id,
    }, '-salt -password', function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    });
  }));
};
