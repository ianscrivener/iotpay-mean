'use strict';

// Devices controller
angular.module('devices').controller('DevicesController', ['$scope', '$http', '$stateParams', '$location', '$modal', 'Authentication', 'Devices',
	function($scope, $http, $stateParams, $location, $modal, Authentication, Devices) {
		$scope.authentication = Authentication;


		$scope.viewDeviceData = function(device) {
			$location.path('devices/' + device._id);
		};

		$scope.findOneLog = function() {
			$http({
        method: 'GET',
        url: '/logs/' + $stateParams.deviceId,
      }).success(function(logs) {
        $scope.log = logs[0];
      });
		};

		$scope.createNewDeviceModal = function() {
		 var modalInstance = $modal.open({
        templateUrl: '/modules/devices/views/create.modal.client.view.html',
        controller: 'DevicesController'
      });
      modalInstance.result.then(function(name) {
				var device = new Devices ({
					name: name
				});
				device.$save(function(response) {
					$scope.devices.push(response);

					// Clear form fields
					$scope.name = '';
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
      }, function() {
      });
		};

		$scope.editDeviceModal = function(device) {
			$scope.deviceCopy = angular.copy(device);
		 	var modalInstance = $modal.open({
        templateUrl: '/modules/devices/views/edit.modal.client.view.html',
        controller: 'DevicesController',
        scope: $scope
      });
      modalInstance.result.then(function(deviceCopy) {
      	device = deviceCopy; 

				device.$update(function(response) {
					$scope.devices.forEach(function(device, i) {
						if(device._id === response._id) {
							$scope.devices[i] = response;
						}
					});
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
      }, function() {
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