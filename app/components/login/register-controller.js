'use strict';

angular.module('iMLApp.register.register-controller', [])

  .controller('RegisterCtrl', ['$scope', 'UserService', '$location', '$rootScope', 'FlashService', function
    ($scope, UserService, $location, $rootScope, FlashService) {


    $scope.userRegister = function () {
      $scope.viewm.dataLoading = true;
      UserService.Create($scope.viewm.user)
        .then(function (response) {
          if (response.success) {
            FlashService.Success('Registration successful', true);
            $location.path('/login');
          } else {
            FlashService.Error(response.message);
            $scope.viewm.dataLoading = false;
          }
        });
    }


  }]);