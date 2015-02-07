'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Payments Schema
 */
var PaymentsSchema = new Schema({

});

mongoose.model('Payment', PaymentSchema);