'use strict';

/**
 * Module dependencies.
 */
var config = require('./config'),
  chalk = require('chalk'),
  path = require('path'),
  sequelize = require('sequelize');

module.exports.loadModels = function (db) {
  var models = {};

  config.files.models.forEach(function (modelPath) {
    Object.assign(models, db.import(path.resolve(modelPath)));
  });

  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models)
    }
  })

  sequelize.model = (name) => {
    return models[name];
  };
  
  return models;
};

module.exports.connect = function (cb) {
  var db = new sequelize(config.db.uri);
  db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    if (cb) cb(db);
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });
};

module.exports.disconnect = function (cb) {
  sequelize.close();
};
