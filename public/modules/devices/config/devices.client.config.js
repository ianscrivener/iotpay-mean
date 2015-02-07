'use strict';

// Configuring the Articles module
angular.module('devices').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Devices', 'devices', 'dropdown', '/devices(/create)?');
		Menus.addSubMenuItem('topbar', 'devices', 'List Devices', 'devices');
		Menus.addSubMenuItem('topbar', 'devices', 'New Device', 'devices/create');
	}
]);