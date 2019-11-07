'use strict';

var express = require('express'),
  bodyParser = require('body-parser'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  cors = require('cors'),
  morgan = require('morgan'),
  path = require('path'),
  config = require('../lib/config');

module.exports.initMiddleware = function (app) {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Disable views cache
  app.set('view cache', false);

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use(cookieParser());
  app.use(helmet())
};

module.exports.initAuthentication = function (app) {
  // Use Passport to authenticate
  var passport = require('../lib/passport');
  passport(app);
};

module.exports.initLogger = function (app) {
  var winston = require('../lib/winston');

  // morgan.token('req', function (req, res, field) {
  //   // get header
  //   var header = req.headers[field.toLowerCase()];
  
  //   return Array.isArray(header)
  //     ? header.join(', ')
  //     : header;
  // });

  app.use(morgan(':method :url :response-time', { stream: winston.stream }));
}

module.exports.initSwagger = function (app) {
  // Use Swagger to document API
  var swagger = require('../lib/swagger');
  swagger(app);
};

module.exports.initRoutes = function (app) {
  // Setting the app router and static folder
  app.use(express.static(path.resolve('./client')));

  // Enable CORS from client-side
  app.use(cors());

  // Globbing routing files
  config.files.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db, logger) {
  var app = express();

  this.initMiddleware(app);
  this.initAuthentication(app);
  this.initLogger(app);
  this.initSwagger(app);
  this.initRoutes(app);

  return app;
};
