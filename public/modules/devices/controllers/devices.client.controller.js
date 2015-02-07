'use strict';

// Devices controller
angular.module('devices').controller('DevicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Devices',
	function($scope, $stateParams, $location, Authentication, Devices) {
		$scope.authentication = Authentication;

		// Create new Device
		$scope.create = function() {
			// Create new Device object
			var device = new Devices ({
				name: this.name
			});

			// Redirect after save
			device.$save(function(response) {
				$location.path('devices/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Device
		$scope.remove = function(device) {
			if ( device ) { 
				device.$remove();

				for (var i in $scope.devices) {
					if ($scope.devices [i] === device) {
						$scope.devices.splice(i, 1);
					}
				}
			} else {
				$scope.device.$remove(function() {
					$location.path('devices');
				});
			}
		};

		// Update existing Device
		$scope.update = function() {
			var device = $scope.device;

			device.$update(function() {
				$location.path('devices/' + device._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Devices
		$scope.find = function() {
			$scope.devices = Devices.query();
		};

		// Find existing Device
		$scope.findOne = function() {
			$scope.device = Devices.get({ 
				deviceId: $stateParams.deviceId
			});
		};
	}
]);