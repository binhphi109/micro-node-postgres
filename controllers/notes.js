'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  path = require('path'),
  sequelize = require('sequelize'),
  Note = sequelize.model('Note'),
  errorHandler = require('./errors');

/**
 * Create a Note
 */
exports.create = function(req, res) {

  var content = req.body.content;

  Note.create({
    content,
    userId: req.user.id,
  }).then(note => {

    res.jsonp(note);

  }).catch(err => {
    console.error('Error: ', err);
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current Note
 */
exports.read = function(req, res) {
  Note.findOne({
    where : {
      id: req.params.noteId,
    },
  }).then(note => {
    if (!note) {
      console.error('Error: ', err);
      return res.status(404).send({
        message: 'No Note with that identifier has been found'
      });
    }

    res.jsonp(note);
  }).catch(err => {
    console.error('Error: ', err);
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Notes
 */
exports.list = function(req, res) { 

  Note.findAll({ 
    where: { 
      'userId': req.user.id,
    } 
  }).then(notes => {
    res.jsonp(notes);
  }).catch(err => {
    console.error('Error: ', err);
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
