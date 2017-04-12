/*
 * Copyright (c) 2017
 * Feiertag Tamara, Waltl Christine, Wolf Julian
 */

(function () {
  'use strict';

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
      .when('/register', {
        templateUrl: 'components/login/register.html',
        controller: 'RegisterCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });

  }])
  .run(run);


run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
function run($rootScope, $location, $cookies, $http) {
  // keep user logged in after page refresh
  $rootScope.globals = $cookies.getObject('globals') || {};
  if ($rootScope.globals.currentUser) {
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
  }

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    // redirect to login page if not logged in and trying to access a restricted page
    var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
    var loggedIn = $rootScope.globals.currentUser;
    if (restrictedPage && !loggedIn) {
      $location.path('/login');
    }
  });
}

})();


