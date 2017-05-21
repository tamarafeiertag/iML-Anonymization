'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-controller', [])

  .controller('ILCtrl', function ($scope, $q, ILService, algoConfig, anonymizationConfig, $rootScope, $state, SurveyService) {

    anonymizationConfig['VECTOR'] = 'equal_weights';

    $scope.showTooltipFirst = false;
    $scope.showTooltipSecond = false;
    $scope.learningContainerVisible = false;
    $scope.showLoading = true;

    $scope.formatNumber = function(i) {
      return Math.round(i * 10000)/10000;
    };

    $scope.columnNames = SurveyService.GetVisibleColumnNames();

    $scope.loading = true;
    $scope.allCases = [];
    $scope.userDecisions = [];
    $scope.dataTop = [];
    $scope.dataBottom = [];
    $scope.weightVecTop = [];
    $scope.weightVecBottom = [];
    $scope.center = {};
    $scope.movedUp = false;
    $scope.movedDown = false;
    $scope.currentRound = 1;
    $scope.currentKFactor = algoConfig.startKFactor;

    let currentRecordIdx = 0;
    console.log(currentRecordIdx);

    $scope.setRecords = function() {
      $scope.dataTop = [];
      $scope.dataBottom = [];
      $scope.center = {};
      if ($scope.allCases.length > currentRecordIdx) {
        $scope.learningContainerVisible = false;
        $scope.showLoading = true;
        $scope.center = $scope.allCases[currentRecordIdx].dataPoint._features;
        $scope.dataTop.push($scope.allCases[currentRecordIdx].cluster1);
        $scope.dataTop.push($scope.allCases[currentRecordIdx].cluster1);
        $scope.dataBottom.push($scope.allCases[currentRecordIdx].cluster2);
        $scope.dataBottom.push($scope.allCases[currentRecordIdx].cluster2);
        $scope.weightVecTop = ILService.getWeightsArray($scope.allCases[currentRecordIdx].weights);
        $scope.weightVecBottom = ILService.getWeightsArray($scope.allCases[currentRecordIdx].weights);
        $scope.showLoading = false;
        $scope.learningContainerVisible = true;
      } else if ($scope.currentRound < (algoConfig.maxKFactor - algoConfig.startKFactor)) {
        console.log("user decisions for round " + $scope.currentRound + ": ", $scope.userDecisions);
        $scope.learningContainerVisible = false;
        $scope.showLoading = true;
        $scope.currentRound += 1;
        $scope.currentKFactor += 1;
        currentRecordIdx = 0;
        ILService.saveUserDecisionsAndCalculateNewWeights($scope.userDecisions);
        $scope.retrieveNewCases();
      } else {
        $scope.learningContainerVisible = false;
        $scope.showLoading = true;

        ILService.saveUserDecisionsAndCalculateNewWeights($scope.userDecisions);

        // last round finished, send final results in json file
        ILService.sendFinalResultsFile();
        $state.go('summary');
      }
    };

    $scope.retrieveNewCases = function () {
      var promise_case = ILService.getCases($scope.currentKFactor, algoConfig.nrOfCases);

      promise_case.then(function (data) {
        console.log(algoConfig.nrOfCases, " new cases: ", data);
        $scope.allCases = data;
        $scope.setRecords();
      }, function(reason) {              //error
        console.log("ILCTrl " + "[error] retrieving of anonymized clusters and centers failed: ", reason);
      });
    };

    $scope.retrieveNewCases();
    var centerRecordTag = $("#panel-center");

    $scope.up = function () {
      //console.log("[ILCtrl] data record sent up");

      if($scope.movedUp || $scope.movedDown)
        return;

      let userDecision = {};
      userDecision.cat_level = $scope.allCases[currentRecordIdx].cluster1_cat_level;
      userDecision.cont_range = $scope.allCases[currentRecordIdx].cluster1_cont_range;
      userDecision.dataPoint = $scope.allCases[currentRecordIdx].dataPoint;
      userDecision.datapoint_cat_level = $scope.allCases[currentRecordIdx].datapoint_cat_level;
      $scope.userDecisions.push(userDecision);

      $scope.movedUp = true;
      centerRecordTag.one('webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd',
        function(e) {
          // code to execute after transition ends
          currentRecordIdx += 1;
          $scope.setRecords();
          $scope.movedUp = false;
          $scope.$digest();
      });
    };

    $scope.down = function () {
      //console.log("[ILCtrl] data record sent down");

      if($scope.movedUp || $scope.movedDown)
        return;

      let userDecision = {};
      userDecision.cat_level = $scope.allCases[currentRecordIdx].cluster2_cat_level;
      userDecision.cont_range = $scope.allCases[currentRecordIdx].cluster2_cont_range;
      userDecision.dataPoint = $scope.allCases[currentRecordIdx].dataPoint;
      userDecision.datapoint_cat_level = $scope.allCases[currentRecordIdx].datapoint_cat_level;
      $scope.userDecisions.push(userDecision);

      $scope.movedDown = true;
      centerRecordTag.one('webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd',
      function(e) {
        // code to execute after transition ends
        currentRecordIdx += 1;
        $scope.setRecords();
        $scope.movedDown = false;
        $scope.$digest();
      });
    };

    $scope.trash = function () {
      console.log("[ILCtrl] data record trashed");

      var promise_case = ILService.getCases($scope.currentKFactor, 1);

      promise_case.then(function (data) {
        currentRecordIdx += 1;      // skips the current case => no user decision
        $scope.allCases.push(data[0]); //therefore, adds new case
        $scope.setRecords();
        console.log("case ", data[0]);
      }, function(reason) {              //error
        console.log("ILCTrl " + "[error] retrieving of anonymized clusters and centers failed: ", reason);
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

    angular.element(document).bind('keydown', function(event) {
      //console.log(value.keyCode);
      if(event.keyCode == 38) { //arrow up key pressed
        $("#buttonUp").click()
      } else if(event.keyCode == 40) { //arrow down key pressed
        $("#buttonDown").click()
      }
    });

  });