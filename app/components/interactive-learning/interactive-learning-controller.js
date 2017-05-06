'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-controller', [])

  .controller('ILCtrl', function ($scope, $q, ILService, algoConfig) {

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
    $scope.userDecisions = [];
    $scope.dataTop = [];
    $scope.dataBottom = [];
    $scope.weightVecTop = [];
    $scope.weightVecBottom = [];
    $scope.center = {};
    $scope.movedUp = false;
    $scope.movedDown = false;
    $scope.currentRound = 0;
    $scope.currentKFactor = algoConfig.startKFactor;

    let currentRecordIdx = 0;

    $scope.setRecords = function() {
      $scope.dataTop = [];
      $scope.dataBottom = [];
      $scope.center = {};
      if ($scope.allCases.length > currentRecordIdx) {
        $scope.center = $scope.allCases[currentRecordIdx].dataPoint._features;
        $scope.dataTop.push($scope.allCases[currentRecordIdx].cluster1);
        $scope.dataTop.push($scope.allCases[currentRecordIdx].cluster1);
        $scope.dataBottom.push($scope.allCases[currentRecordIdx].cluster2);
        $scope.dataBottom.push($scope.allCases[currentRecordIdx].cluster2);
        $scope.weightVecTop = ILService.getWeightsArray($scope.allCases[currentRecordIdx].weights);
        $scope.weightVecBottom = ILService.getWeightsArray($scope.allCases[currentRecordIdx].weights);
      } else if ($scope.currentRound < (algoConfig.maxKFactor - algoConfig.startKFactor)) {
        $scope.currentRound += 1;
        $scope.currentKFactor += 1;
        currentRecordIdx = 0;
        ILService.saveUserDecisionsAndCalculateNewWeights($scope.userDecisions);
        $scope.retrieveNewCases();
      } else {
        $scope.learningContainerVisible = false;
        $scope.showDoneMessage = true;
      }
    };

    $scope.retrieveNewCases = function () {
      var promise_case = ILService.getCases($scope.currentKFactor);

      promise_case.then(function (data) {
        $scope.allCases = data;
        $scope.setRecords();
      }, function(reason) {              //error
        console.log("ILCTrl " + "[error] retrieving of anonymized clusters and centers failed: ", reason);
      });
    };

    $scope.retrieveNewCases();
    var centerRecordTag = $("#panel-center");

    $scope.up = function () {
      console.log("[ILCtrl] data record sent up");

      let userDecision = {};
      userDecision.cat_level = $scope.allCases[currentRecordIdx].cluster1_cat_level;
      userDecision.cont_range = $scope.allCases[currentRecordIdx].cluster1_cont_range;
      userDecision.dataPoint = $scope.allCases[currentRecordIdx].dataPoint;
      userDecision.datapoint_cat_level = $scope.allCases[currentRecordIdx].datapoint_cat_level;
      $scope.userDecisions.push(userDecision);

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

      let userDecision = {};
      userDecision.cat_level = $scope.allCases[currentRecordIdx].cluster2_cat_level;
      userDecision.cont_range = $scope.allCases[currentRecordIdx].cluster2_cont_range;
      userDecision.dataPoint = $scope.allCases[currentRecordIdx].dataPoint;
      userDecision.datapoint_cat_level = $scope.allCases[currentRecordIdx].datapoint_cat_level;
      $scope.userDecisions.push(userDecision);

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
      //console.log(value.keyCode);
      if(value.keyCode == 38) { //arrow up key pressed
        $scope.up();
      } else if(value.keyCode == 40) { //arrow down key pressed
        $scope.down();
      }
    };

  });