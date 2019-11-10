'use strict';

var bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  config = require('../lib/config');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.TEXT,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.TEXT,
    },
  });

  User.associate = models => {
    User.hasMany(models.Note, { foreignKey: 'userId' });
  };

  User.generateJWT = function (user) {
    return jwt.sign({
      id: user.id
    }, config.tokenSecret, {
      expiresIn: config.tokenExpiresIn,
    });
  };

  return User;
};