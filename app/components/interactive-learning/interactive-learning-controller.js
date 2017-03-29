'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-controller', [])

  .controller('ILCtrl', function ($scope, ILService) {

    $scope.columnNames = ["age", "education-num","hours-per-week", "workclass", "native-country", "sex", "race",
      "relationship","occupation","income", "marital-status"];

    $scope.data = [];

    console.log("ILCTrl " + $scope.columnNames);



    ILService.getMaritalStatusK2(function(data) {
      console.log(data);
      $scope.data = data;
    });

      ILService.getTestdata(function(data) {
          console.log(data);
          $scope.data = data;
      });

    $scope.up = function () {
      console.log("[ILCtrl] data record sent up");
    };
    $scope.down = function () {
      console.log("[ILCtrl] data record sent down");
    }
  });