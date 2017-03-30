'use strict';

// Declare app level module which depends on views, components and reusable_components
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.routes',
  'myApp.login',
  'myApp.sliders',
  'myApp.interactive-learning',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]);
