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
  'iMLApp.summary',
  'iMLApp.version',
  'iMLApp.register',
  'iMLApp.sliders',
  'pageslide-directive',
  'ngCookies',
  'iMLApp.user-overview'
]);

  /*.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]);*/
