'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-controller', [])

  .controller('ILCtrl', function ($scope, ILService) {

    ILService.getAnonymizationRecords();

    $scope.showDiagram = false;
    $scope.showTooltipFirst = false;
    $scope.showTooltipSecond = false;

    $scope.columnNames = ["age", "education-num","hours-per-week", "workclass", "native-country", "sex", "race",
      "relationship","occupation","income", "marital-status"];
    $scope.weights = ["0.1", "0.1","0.1", "0.1","0.1", "0.1", "0.1", "0.1", "0.1","0.1","0.1"];

    $scope.allDataRecords = [];
    $scope.dataTop = [];
    $scope.dataBottom = [];
    $scope.center;
    $scope.movedUp = false;
    $scope.movedDown = false;

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

    var centerRecordTag = $("#panel-center");

    $scope.up = function () {
      console.log("[ILCtrl] data record sent up");
      $scope.movedUp = true;
      centerRecordTag.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
        function(e) {
          // code to execute after transition ends
          currentRecordIdx += 6;
          $scope.setRecords();
          $scope.movedUp = false;
          $scope.$digest();
      });
    };

    $scope.down = function () {
      console.log("[ILCtrl] data record sent down");
      $scope.movedDown = true;
      centerRecordTag.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
      function(e) {
        // code to execute after transition ends
        currentRecordIdx += 6;
        $scope.setRecords();
        $scope.movedDown = false;
        $scope.$digest();
      });
    };

    $scope.showTooltip = function (val, element) {
      $scope.showDiagram = false;
      if(element == 1)
      {
        $scope.showTooltipFirst = val;
      }
      else if(element == 2)
      {
        $scope.showTooltipSecond = val;
      }

    };

    $scope.openDiagram = function()
    {
      $scope.showDiagram = true;
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