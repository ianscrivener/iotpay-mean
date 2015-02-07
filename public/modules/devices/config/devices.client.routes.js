'use strict';

//Setting up route
angular.module('devices').config(['$stateProvider',
	function($stateProvider) {
		// Devices state routing
		$stateProvider.
		state('listDevices', {
			url: '/devices',
			templateUrl: 'modules/devices/views/list-devices.client.view.html'
		}).
		state('viewDeviceData', {
			url: '/devices/:deviceId',
			templateUrl: 'modules/devices/views/data-devices.client.view.html'
		});
	}
]);