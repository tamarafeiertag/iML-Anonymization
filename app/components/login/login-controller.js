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

      var vm = this;

      vm.login = login;

      (function initController() {
        // reset login status
        AuthenticationService.ClearCredentials();
      })();

      function userLogin() {
        vm.dataLoading = true;
        document.getElementById("menu_options").style.visibility = 'visible';

        AuthenticationService.Login(vm.username, vm.password, function (response) {
          if (response.success) {
            AuthenticationService.SetCredentials(vm.username, vm.password);
            $location.path('/');
          } else {
            FlashService.Error(response.message);
            vm.dataLoading = false;
          }
        });
      }

  }]);