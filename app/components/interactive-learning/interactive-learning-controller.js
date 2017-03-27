'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-controller', [])

  .controller('ILCtrl', ['$scope', function ($scope) {

    $scope.up = function () {
      console.log("[ILCtrl] data record sent up");
    };
    $scope.down = function () {
      console.log("[ILCtrl] data record sent down");
    }
  }]);