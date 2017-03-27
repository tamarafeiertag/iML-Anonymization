/*
 * Copyright (c) 2017
 * Feiertag Tamara, Waltl Christine, Wolf Julian
 */

angular.module('myApp.routes', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'components/login/login.html',
      controller: 'LoginCtrl'
    });
  }])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/interactive-learning', {
      templateUrl: 'components/interactive-learning/interactive-learning.html',
      controller: 'ILCtrl'
    });
  }])