'use strict';

var winston = require('winston'),
  util = require('util'),
  config = require('./config');

var options = {
  console: {
    level: 'info',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(function (info) {
        // var userInfo = info.meta && info.meta.username ? info.meta.username + '@' + info.meta.companyName + ' - ' : '';
        // var message = typeof info.message === 'object' ? JSON.stringify(info.message) : info.message;
        // return '\u001b[36m' + moment(info.timestamp).tz('CET').format('HH:mm:ss') + ': \u001b[35m' + userInfo + '\u001b[0m' + message;
        return info.message;
      })
    ),
    colorize: true
  },
};

//Default transports
var transports = [
  new winston.transports.Console(options.console)
];

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
  transports,
  exitOnError: false // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

function formatArgs(args) {
  return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function () {
  logger.info.apply(logger, formatArgs(arguments));
};
console.info = function () {
  logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function () {
  logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function () {
  logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function () {
  logger.debug.apply(logger, formatArgs(arguments));
};

module.exports = logger;