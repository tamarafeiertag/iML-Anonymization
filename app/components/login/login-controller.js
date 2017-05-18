'use strict';

angular.module('iMLApp.login.login-controller', [])

  .controller('LoginCtrl', ['$scope', '$location', 'AuthenticationService', 'FlashService',
    function ($scope, $location, AuthenticationService, FlashService) {

      $scope.degree = [
        { id: 1, description: 'secondary modern school' },
        { id: 2, description: 'Abitur' },
        { id: 3, description: 'Bachelor degree' },
        { id: 4, description: 'Master degree' },
        { id: 5, description: 'Doctoral degree' }];

      document.getElementById("menu_options").style.visibility = 'hidden';

      $scope.viewm = this;
      $scope.viewm.selectedEducation = $scope.degree[0]

      $scope.viewm.userLogin = $scope.userLogin;

      (function initController() {
        // reset login status
        AuthenticationService.ClearCredentials();
      })();

      $scope.takeSurvey = function () {
        AuthenticationService.SetInfos($scope.viewm.age, $scope.viewm.degree, (new Date()).getTime());
        document.getElementById("menu_options").style.visibility = 'visible';
        $location.path('/survey-overview');
      };

      $scope.userLogin = function() {
        $scope.viewm.dataLoading = true;
        AuthenticationService.Login($scope.viewm.username, $scope.viewm.password, function (response) {
          if (response.success) {
            document.getElementById("menu_options").style.visibility = 'visible';
            AuthenticationService.SetCredentials($scope.viewm.username, $scope.viewm.password);
            $location.path('/survey-overview');
          } else {
            FlashService.Error(response.message);
            $scope.viewm.dataLoading = false;
          }
        });
      };

  }]);