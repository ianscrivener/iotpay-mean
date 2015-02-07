'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Device = mongoose.model('Device'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, device;

/**
 * Device routes tests
 */
describe('Device CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Device
		user.save(function() {
			device = {
				name: 'Device Name'
			};

			done();
		});
	});

	it('should be able to save Device instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Device
				agent.post('/devices')
					.send(device)
					.expect(200)
					.end(function(deviceSaveErr, deviceSaveRes) {
						// Handle Device save error
						if (deviceSaveErr) done(deviceSaveErr);

						// Get a list of Devices
						agent.get('/devices')
							.end(function(devicesGetErr, devicesGetRes) {
								// Handle Device save error
								if (devicesGetErr) done(devicesGetErr);

								// Get Devices list
								var devices = devicesGetRes.body;

								// Set assertions
								(devices[0].user._id).should.equal(userId);
								(devices[0].name).should.match('Device Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Device instance if not logged in', function(done) {
		agent.post('/devices')
			.send(device)
			.expect(401)
			.end(function(deviceSaveErr, deviceSaveRes) {
				// Call the assertion callback
				done(deviceSaveErr);
			});
	});

	it('should not be able to save Device instance if no name is provided', function(done) {
		// Invalidate name field
		device.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Device
				agent.post('/devices')
					.send(device)
					.expect(400)
					.end(function(deviceSaveErr, deviceSaveRes) {
						// Set message assertion
						(deviceSaveRes.body.message).should.match('Please fill Device name');
						
						// Handle Device save error
						done(deviceSaveErr);
					});
			});
	});

	it('should be able to update Device instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Device
				agent.post('/devices')
					.send(device)
					.expect(200)
					.end(function(deviceSaveErr, deviceSaveRes) {
						// Handle Device save error
						if (deviceSaveErr) done(deviceSaveErr);

						// Update Device name
						device.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Device
						agent.put('/devices/' + deviceSaveRes.body._id)
							.send(device)
							.expect(200)
							.end(function(deviceUpdateErr, deviceUpdateRes) {
								// Handle Device update error
								if (deviceUpdateErr) done(deviceUpdateErr);

								// Set assertions
								(deviceUpdateRes.body._id).should.equal(deviceSaveRes.body._id);
								(deviceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Devices if not signed in', function(done) {
		// Create new Device model instance
		var deviceObj = new Device(device);

		// Save the Device
		deviceObj.save(function() {
			// Request Devices
			request(app).get('/devices')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Device if not signed in', function(done) {
		// Create new Device model instance
		var deviceObj = new Device(device);

		// Save the Device
		deviceObj.save(function() {
			request(app).get('/devices/' + deviceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', device.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Device instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Device
				agent.post('/devices')
					.send(device)
					.expect(200)
					.end(function(deviceSaveErr, deviceSaveRes) {
						// Handle Device save error
						if (deviceSaveErr) done(deviceSaveErr);

						// Delete existing Device
						agent.delete('/devices/' + deviceSaveRes.body._id)
							.send(device)
							.expect(200)
							.end(function(deviceDeleteErr, deviceDeleteRes) {
								// Handle Device error error
								if (deviceDeleteErr) done(deviceDeleteErr);

								// Set assertions
								(deviceDeleteRes.body._id).should.equal(deviceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Device instance if not signed in', function(done) {
		// Set Device user 
		device.user = user;

		// Create new Device model instance
		var deviceObj = new Device(device);

		// Save the Device
		deviceObj.save(function() {
			// Try deleting Device
			request(app).delete('/devices/' + deviceObj._id)
			.expect(401)
			.end(function(deviceDeleteErr, deviceDeleteRes) {
				// Set message assertion
				(deviceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Device error error
				done(deviceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Device.remove().exec();
		done();
	});
});