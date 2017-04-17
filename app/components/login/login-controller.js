'use strict';

angular.module('iMLApp.login.login-controller', [])

  .controller('LoginCtrl', ['$scope', '$location', 'AuthenticationService', 'FlashService',
    function ($scope, $location, AuthenticationService, FlashService) {

/*    $scope.email = 'tami@pro.at';
    $scope.password = 'nerd';
    document.getElementById("menu_options").style.visibility = 'hidden';

    $scope.userLogin = function () {
      console.log("login");
      document.getElementById("menu_options").style.visibility = 'visible';
      window.location.href = "#/survey-overview";
    };

    $scope.userRegister = function () {
      console.log("register");
    };*/

      document.getElementById("menu_options").style.visibility = 'hidden';

      $scope.viewm = this;

      $scope.viewm.userLogin = $scope.userLogin;

      (function initController() {
        // reset login status
        AuthenticationService.ClearCredentials();
      })();

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