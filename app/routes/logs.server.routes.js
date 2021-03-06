'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var devices = require('../../app/controllers/devices.server.controller');
  var logs = require('../../app/controllers/logs.server.controller');

  // Devices Routes

  app.route('/scriv')
      .get(logs.scriv);

  app.route('/logs/:deviceId')
      .get(devices.hasAuthorization, logs.list);

  app.route('/logs/IoT/:deviceName')
      .post(logs.create);  //TODO: secure this route via secret in header (post will be coming from IoT device)

  app.route('/logs/:deviceId/:logId')
    .get(users.requiresLogin, devices.hasAuthorization, logs.read)
    .put(users.requiresLogin, devices.hasAuthorization, logs.update)
    .delete(users.requiresLogin, devices.hasAuthorization, logs.delete);

  // Finish by binding the Device middleware
  app.param('deviceId', devices.deviceByID);
  app.param('deviceName', devices.deviceByName);
  app.param('logId', logs.logByID);
};
