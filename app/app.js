'use strict';

// Declare app level module which depends on views, components and reusable_components
angular.module('iMLApp', [
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'iMLApp.routes',
  'iMLApp.login',
  'iMLApp.interactive-learning',
  'iMLApp.survey-overview',
  'iMLApp.version',
  'pageslide-directive'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {


}]);
