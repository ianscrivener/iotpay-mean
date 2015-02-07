'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var payments = require('../../app/controllers/payments.server.controller');

  //To Come 

  // Finish by binding the Device middleware
  app.param('deviceId', devices.deviceByID);
};