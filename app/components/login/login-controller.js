'use strict';

angular.module('iMLApp.login.login-controller', [])

  .controller('LoginCtrl', ['$scope', function ($scope) {

    $scope.email = 'tami@pro.at';
    $scope.password = 'nerd';
  }]);