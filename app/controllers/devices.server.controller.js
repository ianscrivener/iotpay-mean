'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Device = mongoose.model('Device'),
	_ = require('lodash');

/**
 * Create a Device
 */
exports.create = function(req, res) {
	var device = new Device(req.body);
	device.biller = req.user;

	device.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};

/**
 * Show the current Device
 */
exports.read = function(req, res) {
	res.jsonp(req.device);
};

/**
 * Update a Device
 */
exports.update = function(req, res) {
	var device = req.device ;

	device = _.extend(device , req.body);

	device.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};

/**
 * Delete a Device
 */
exports.delete = function(req, res) {
	var device = req.device ;

	device.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};

/**
 * List of Devices
 */
exports.list = function(req, res) { 
	Device.find().sort('-created').populate('user', 'displayName').exec(function(err, devices) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(devices);
		}
	});
};

/**
 * Get Device Config
 */
exports.config = function(req, res) { 
	res.jsonp({
		dataPeriod: 1,
		configPeriod: 5,
		thresholdWarn: 65,
		thresholdLimit: 73
	});

	// Device.find().sort('-created').populate('user', 'displayName').exec(function(err, devices) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(devices);
	// 	}
	// });
};


/**
 * Device middleware
 */
exports.deviceByID = function(req, res, next, id) { 
	Device.find({}).populate('biller').exec(function(err, devices) {
		if(err) {
			console.log(err);
		}
		var device = devices[0];	
		if (err) return next(err);
		if (! device) return next(new Error('Failed to load Device ' + id));
		req.device = device ;
		next();
	});
};

/**
 * Device authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

	if (req.device.biller.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
