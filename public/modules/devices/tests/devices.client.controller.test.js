'use strict';

(function() {
	// Devices Controller Spec
	describe('Devices Controller Tests', function() {
		// Initialize global variables
		var DevicesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Devices controller.
			DevicesController = $controller('DevicesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Device object fetched from XHR', inject(function(Devices) {
			// Create sample Device using the Devices service
			var sampleDevice = new Devices({
				name: 'New Device'
			});

			// Create a sample Devices array that includes the new Device
			var sampleDevices = [sampleDevice];

			// Set GET response
			$httpBackend.expectGET('devices').respond(sampleDevices);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.devices).toEqualData(sampleDevices);
		}));

		it('$scope.findOne() should create an array with one Device object fetched from XHR using a deviceId URL parameter', inject(function(Devices) {
			// Define a sample Device object
			var sampleDevice = new Devices({
				name: 'New Device'
			});

			// Set the URL parameter
			$stateParams.deviceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/devices\/([0-9a-fA-F]{24})$/).respond(sampleDevice);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.device).toEqualData(sampleDevice);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Devices) {
			// Create a sample Device object
			var sampleDevicePostData = new Devices({
				name: 'New Device'
			});

			// Create a sample Device response
			var sampleDeviceResponse = new Devices({
				_id: '525cf20451979dea2c000001',
				name: 'New Device'
			});

			// Fixture mock form input values
			scope.name = 'New Device';

			// Set POST response
			$httpBackend.expectPOST('devices', sampleDevicePostData).respond(sampleDeviceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Device was created
			expect($location.path()).toBe('/devices/' + sampleDeviceResponse._id);
		}));

		it('$scope.update() should update a valid Device', inject(function(Devices) {
			// Define a sample Device put data
			var sampleDevicePutData = new Devices({
				_id: '525cf20451979dea2c000001',
				name: 'New Device'
			});

			// Mock Device in scope
			scope.device = sampleDevicePutData;

			// Set PUT response
			$httpBackend.expectPUT(/devices\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/devices/' + sampleDevicePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid deviceId and remove the Device from the scope', inject(function(Devices) {
			// Create new Device object
			var sampleDevice = new Devices({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Devices array and include the Device
			scope.devices = [sampleDevice];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/devices\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDevice);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.devices.length).toBe(0);
		}));
	});
}());