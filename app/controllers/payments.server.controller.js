'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
  errorHandler  = require('./errors.server.controller'),
  _             = require('lodash');


var chargeCard  = require('./mastercard/chargeUser');

/**
 * charge
 */
exports.test = function(req, res) {
  chargeCard(222,function(err,data){

    if(err){
      res.jsonp(err);
    }
    else{
      res.jsonp(data);
    }

  });
};
