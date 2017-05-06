'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-controller', [])

  .controller('ILCtrl', function ($scope, $q, ILService) {

    $scope.showDiagram = false;
    $scope.showTooltipFirst = false;
    $scope.showTooltipSecond = false;
    $scope.learningContainerVisible = true;
    $scope.showDoneMessage = false;

    $scope.formatNumber = function(i) {
      return Math.round(i * 10000)/10000;
    };

    $scope.columnNames = ["age", "education-num","hours-per-week", "workclass", "native-country", "sex", "race",
      "relationship","occupation","income", "marital-status"];

    $scope.allCases = [];
    $scope.dataTop = [];
    $scope.dataBottom = [];
    $scope.weightVecTop = [];
    $scope.weightVecBottom = [];
    $scope.center = {};
    $scope.movedUp = false;
    $scope.movedDown = false;

    let currentRecordIdx = 0;

    $scope.setRecords = function() {
      $scope.dataTop = [];
      $scope.dataBottom = [];
      $scope.center = {};
      if ($scope.allCases.length > currentRecordIdx) {
        //console.log("current case idx: ", currentRecordIdx);
        $scope.center = $scope.allCases[currentRecordIdx][0]._features;
        $scope.dataTop.push($scope.allCases[currentRecordIdx][1]);
        $scope.dataTop.push($scope.allCases[currentRecordIdx][1]);
        $scope.dataBottom.push($scope.allCases[currentRecordIdx][2]);
        $scope.dataBottom.push($scope.allCases[currentRecordIdx][2]);
        $scope.weightVecTop = ILService.getWeightsArray($scope.allCases[currentRecordIdx][1].weights);
        $scope.weightVecBottom = ILService.getWeightsArray($scope.allCases[currentRecordIdx][2].weights);
      } else {
        $scope.learningContainerVisible = false;
        $scope.showDoneMessage = true;
      }
    };

    var promise_case = ILService.getCases(2);

    promise_case.then(function (data) {
      console.log("received data: ", data);
      $scope.allCases = data;
      $scope.setRecords();
    }, function(reason) {              //error
      console.log("ILCTrl " + "[error] retrieving of anonymized clusters and centers failed: ", reason);
    });


    var centerRecordTag = $("#panel-center");

    $scope.up = function () {
      console.log("[ILCtrl] data record sent up");
      $scope.movedUp = true;
      centerRecordTag.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd',
        function(e) {
          // code to execute after transition ends
          currentRecordIdx += 1;
          $scope.setRecords();
          $scope.movedUp = false;
          $scope.$digest();
      });
    };

    $scope.down = function () {
      console.log("[ILCtrl] data record sent down");
      $scope.movedDown = true;
      centerRecordTag.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd',
      function(e) {
        // code to execute after transition ends
        currentRecordIdx += 1;
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