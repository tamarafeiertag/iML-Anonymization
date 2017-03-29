/*
 * Copyright (c) 2017
 * Feiertag Tamara, Waltl Christine, Wolf Julian
 */

angular.module('iMLApp.routes', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/login', {
      templateUrl: 'components/login/login.html',
      controller: 'LoginCtrl'
    })
      .when('/interactive-learning', {
      templateUrl: 'components/interactive-learning/interactive-learning.html',
      controller: 'ILCtrl'
    })
      .when('/survey-overview', {
      templateUrl: 'components/survey-overview/survey-overview.html',
      controller: 'SurveyOverviewCtrl'
    })
      .otherwise({
        redirectTo: '/login'
      });

  }]);


