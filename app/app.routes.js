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
    $routeProvider.when('/view2', {
      templateUrl: 'components/view2/view2.html',
      controller: 'View2Ctrl'
    });
  }])