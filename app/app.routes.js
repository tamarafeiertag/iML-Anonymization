/*
 * Copyright (c) 2017
 * Feiertag Tamara, Waltl Christine, Wolf Julian
 */

angular.module('iMLApp.routes', ['ui.router'])

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'components/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('interactive-learning', {
        url: '/interactive-learning',
        templateUrl: 'components/interactive-learning/interactive-learning.html',
        controller: 'ILCtrl'
      })
      .state('slider-learning', {
        url: '/slider-learning',
        templateUrl: 'components/slider-learning/slider-learning.html',
        controller: 'SlidersCtrl'
      })
      .state('survey-overview', {
        url: '/survey-overview',
        templateUrl: 'components/survey-overview/survey-overview.html',
        controller: 'SurveyOverviewCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'components/login/register.html',
        controller: 'RegisterCtrl'
      })
      .state('user-overview', {
        url: '/user-overview',
        templateUrl: 'components/user-overview/user-overview.html',
        controller: 'UserOverviewCtrl'
      })
      .state('summary', {
        url: '/summary',
        templateUrl: 'components/summary/summary.html',
        controller: 'SummaryCtrl'
      });

      $urlRouterProvider.otherwise('/login');
  })

  .run(['$rootScope', '$cookies', '$http', '$state',
    function ($rootScope, $cookies, $http, $state) {
      // keep user logged in after page refresh (token is save)
      $rootScope.globals = $cookies.getObject('globals') || {};
      $rootScope.$state = $state;

      if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.token;
      }

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = !($state.includes('login'));
        var loggedIn = $rootScope.globals.currentUser;

        if (restrictedPage && !loggedIn) {
          $state.go('login');
        }
      });
    }
  ]);



