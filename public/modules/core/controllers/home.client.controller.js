'use strict';


angular.module('core').controller('HomeController', ['$scope', '$rootScope', '$state', 'Authentication',
	function($scope, $rootScope, $state, Authentication) {
    $scope.$state = $state;
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);