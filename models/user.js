'use strict';

var crypto = require('crypto'),
  jwt = require('jsonwebtoken'),
  config = require('../lib/config');

var model = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
    email: {
      type: DataTypes.TEXT,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
    },
    salt: {
      type: DataTypes.TEXT,
    },
    created: {
      type: DataTypes.DATE,
    },
  });

  User.associate = models => {
    User.hasMany(models.Note);
  };

  User.hashPassword = function (password, salt) {
    if (salt && password) {
      return crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 512, 'sha512').toString('base64');
    } else {
      return password;
    }
  };

  User.generateJWT = function (user) {
    return jwt.sign({
      _id: user._id
    }, config.tokenSecret, {
      expiresIn: config.tokenExpiresIn,
    });
  };

  return { User };
}

module.exports = model;