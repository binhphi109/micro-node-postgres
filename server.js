'use strict';

var config = require('./lib/config'),
  sequelize = require('./lib/sequelize'),
  express = require('./lib/express'),
  chalk = require('chalk');

module.exports.init = function init(callback) {
  sequelize.connect(function (db) {
    // Initialize Models
    sequelize.loadModels(db);

    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config);
  });
};

module.exports.start = function start(callback) {
  this.init(function (app, db, config) {
    // Start the app by listening on <port>
    app.listen(config.port, function () {

      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Port:\t\t\t\t' + config.port));
      console.log(chalk.green('Database:\t\t\t\t' + config.db.uri));
      console.log('--');

      if (callback) callback(app, db, config);
    });
  });
};

module.exports.close = function close(callback) {
  sequelize.disconnect(function (db) {
    if (callback) callback();
  });
};

// Start a server
this.start();
