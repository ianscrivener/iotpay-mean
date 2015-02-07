'use strict';

//Devices service used to communicate Devices REST endpoints
angular.module('devices').factory('Devices', ['$resource',
	function($resource) {
		return $resource('devices/:deviceId', { deviceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);