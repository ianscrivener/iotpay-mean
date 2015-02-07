'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var logs = require('../../app/controllers/logs.server.controller');

  // Devices Routes
  app.route('/logs')
    .get(logs.list)
    .post(users.requiresLogin, logs.create);

  app.route('/logs/:deviceId')
    .get(logs.read)
    .put(users.requiresLogin, devices.hasAuthorization, logs.update)
    .delete(users.requiresLogin, devices.hasAuthorization, logs.delete);

  // Finish by binding the Device middleware
  app.param('deviceId', devices.deviceByID);
};
