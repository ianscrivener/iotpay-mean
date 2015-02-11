'use strict';

var chargeUser = require('./mastercard/chargeUser');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Log = mongoose.model('Log'),
  _ = require('lodash');



// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
exports.scriv = function(req, res) {

  var data  = {amount:6969, description:'blah blah'};
  var cust = {cardNumber: 4111111111111111, expMonth:12, expYear:99, cvc:123, mobile: '+61404464308'};

  chargeUser(data, cust, function(err,ret){
    if(err){
      console.log('chargeUser ERROR', err);
      res.jsonp(err);
    }
    else{
      console.log('chargeUser OK', ret);
      res.jsonp(ret);
    }
  });

};


// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

/**
 * Create a Log
 */
exports.create = function(req, res) {
  var log = new Log(req.body);
  var device = req.device;
  var customer = device.customer;

  console.log('POST from Arduino', req.body);

  log.device = device;

  log.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {

      //Charge user logic - charge if the log percentage exceeded exceeds the threshold
      if(log.percExceeded >=5) {
      // if(log.percExceeded > device.config.thresholdLimit) {
        var data  = {amount:500, description: device.name};
        var customerData = {cardNumber: customer.cardNumber, expMonth: customer.expMonth, expYear: customer.expYear, cvc: customer.cvc, mobile: customer.mobile};

        chargeUser(data, customerData, function(err,ret){
          if(err){
            console.log('chargeUser ERROR', err);
            res.jsonp(err);
          }
          else{
            console.log('chargeUser OK', ret);

            // add charge to device.totalCharges
            device.totalCharges = device.totalCharges + 5;

            device.save(function(err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }
              else {
                res.jsonp(ret);
              }
            });
          }
        });
      }
      else {
          res.jsonp(log);
        }
    }
  });
};




/**
 * Show the current Log
 */
exports.read = function(req, res) {
  res.jsonp(req.log);
};

/**
 * Update a log 
 */
exports.update = function(req, res) {
  var log = req.log ;

  log = _.extend(log, req.body);

  log.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(log);
    }
  });
};

/**
 * Delete a Log
 */
exports.delete = function(req, res) {
  var log = req.log ;

  log.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(log);
    }
  });
};

/**
 * List of  logs
 */
exports.list = function(req, res) { 
  Log.find({device: req.device._id}).sort('-time').populate('device').limit(8).exec(function(err, logs) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(logs);
    }
  });
};

/**
 * Log middleware
 */
exports.logByID = function(req, res, next, id) { 
  Log.findById(id).populate('device').exec(function(err, log) {
    if (err) return next(err);
    if (! log) return next(new Error('Failed to load Log ' + id));
    req.log = log;
    next();
  });
};
