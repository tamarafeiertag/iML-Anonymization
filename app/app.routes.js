/*
 * Copyright (c) 2017
 * Feiertag Tamara, Waltl Christine, Wolf Julian
 */

(function () {
  'use strict';

angular.module('iMLApp.routes', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
  .when('/', {
        templateUrl: 'components/survey-overview/survey-overview.html',
        controller: 'SurveyOverviewCtrl'
      })
  .when('/login', {
      templateUrl: 'components/login/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'viewm'
    })
  .when('/interactive-learning/:sid', {
      templateUrl: 'components/interactive-learning/interactive-learning.html',
      controller: 'ILCtrl'
    })
  .when('/slider-learning/:sid', {
            templateUrl: 'components/slider-learning/slider-learning.html',
            controller: 'SlidersCtrl'
        })
  .when('/survey-overview', {
        templateUrl: 'components/survey-overview/survey-overview.html',
        controller: 'SurveyOverviewCtrl',
        controllerAs: 'vm'
    })
  .when('/register', {
        templateUrl: 'components/login/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'viewm'
      })
  .when('/user-overview', {
      templateUrl: 'components/user-overview/user-overview.html',
      controller: 'UserOverviewCtrl',
      controllerAs: 'vm'
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
      $location.path('#!/login');
    }
  });
}

})();


