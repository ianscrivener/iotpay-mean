'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Device Schema
 */
var LogSchema = new Schema({
  time: {
    type: Date,
    default: Date.now
  },
  device: {
    type: Schema.ObjectId,
    ref: 'Device'
  },
  percExceeded: {
    type: Number
  }, 
  percWarn: {
    type: Number
  }, 
  percUnder: {
    type: Number
  } 
});

mongoose.model('Log', LogSchema);