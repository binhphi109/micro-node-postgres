'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  User = require('sequelize').model('User'),
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
      where: {
        id: jwt_payload._id,
      },
    }).then(user => {

      user.salt = undefined;
      user.password = undefined;

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    }).catch(err => {
      return done(err);
    });
  }));
};
