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
		state('createDevice', {
			url: '/devices/create',
			templateUrl: 'modules/devices/views/create-device.client.view.html'
		}).
		state('viewDevice', {
			url: '/devices/:deviceId',
			templateUrl: 'modules/devices/views/view-device.client.view.html'
		}).
		state('editDevice', {
			url: '/devices/:deviceId/edit',
			templateUrl: 'modules/devices/views/edit-device.client.view.html'
		});
	}
]);