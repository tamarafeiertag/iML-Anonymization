'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-controller', [])

  .controller('ILCtrl', function ($scope, ILService) {

    $scope.columnNames = ["age", "education-num","hours-per-week", "workclass", "native-country", "sex", "race",
      "relationship","occupation","income", "marital-status"];

    $scope.allDataRecords = [];
    $scope.dataTop = [];
    $scope.dataBottom = [];
    $scope.center;

    var currentRecordIdx = 0;

    console.log("ILCTrl " + $scope.columnNames);

    $scope.setRecords = function() {
      $scope.dataTop = [];
      $scope.dataBottom = [];
      $scope.dataTop.push($scope.allDataRecords[currentRecordIdx]);
      $scope.dataTop.push($scope.allDataRecords[currentRecordIdx+1]);
      $scope.dataBottom.push($scope.allDataRecords[currentRecordIdx+2]);
      $scope.dataBottom.push($scope.allDataRecords[currentRecordIdx+3]);
      $scope.center = $scope.allDataRecords[currentRecordIdx+4];
    };

    ILService.getMaritalStatusK2().then(function(data) {
      var countRecords = data.length;
      for (var i = 0; i < countRecords; i++) {
        data[i].id = i;
      }

      $scope.allDataRecords = data;
      $scope.setRecords();

      console.log($scope.dataTop);
      console.log($scope.dataBottom);
    });


    $scope.up = function () {
      console.log("[ILCtrl] data record sent up");
      $("#panel-center").toggleClass("movedUp");
      //currentRecordIdx += 6;
      //$scope.setRecords();
    };

    $scope.down = function () {
      console.log("[ILCtrl] data record sent down");
      $("#panel-center").toggleClass("movedDown");
      //currentRecordIdx += 6;
      //$scope.setRecords();
    };

    $scope.keyDown = function(value){
      console.log(value.keyCode);
      if(value.keyCode == 38) { //arrow up key pressed
        $scope.up();
      } else if(value.keyCode == 40) { //arrow down key pressed
        $scope.down();
      }
    };

  });