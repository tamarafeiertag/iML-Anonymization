'use strict';

// Declare app level module which depends on views, components and reusable_components
angular.module('iMLApp', [
  'ngResource',
  'ngAnimate',
  'iMLApp.routes',
  'iMLApp.config',
  'iMLApp.login',
  'iMLApp.interactive-learning',
  'iMLApp.slider-learning',
  'iMLApp.survey-overview',
  'iMLApp.services.survey-service',
  'iMLApp.services.data-send-service',
  'iMLApp.summary',
  'iMLApp.version',
  'iMLApp.sliders',
  'pageslide-directive',
  'ngCookies',
  'iMLApp.servercom'
]);

  /*.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]);*/
