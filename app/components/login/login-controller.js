'use strict';

angular.module('iMLApp.login.login-controller', [])

  .controller('LoginCtrl', function ($scope, AuthenticationService, LoginService, $location) {

      $scope.context = {};
      $scope.context.degrees = LoginService.getDegrees();
      $scope.context.selectedEducation = $scope.context.degrees[0].id.toString();

      (function initController() {
        // reset login status
        AuthenticationService.ClearCredentials();
      })();

      // begin survey as new user (new token)
      $scope.takeSurvey = function () {
        var degree_index = $scope.context.selectedEducation - 1;
        AuthenticationService.SetInfos($scope.context.usertoken, $scope.context.age, $scope.context.degrees[degree_index], (new Date()).getTime());
        $location.path('survey-overview').replace();
      };

  });