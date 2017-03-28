'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-controller', [])

  .controller('ILCtrl', function ($scope, ILService) {

    console.log("ILCTrl");

    ILService.getTestdata(function(testdata) {
      console.log(testdata);
    });

    $scope.up = function () {
      console.log("[ILCtrl] data record sent up");
    };
    $scope.down = function () {
      console.log("[ILCtrl] data record sent down");
    }
  });