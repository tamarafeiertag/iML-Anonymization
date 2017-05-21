'use strict';

angular.module('iMLApp.summary', [])

  .controller('SummaryCtrl', function ($scope, SlidersService) {
      $scope.loadingAlgo1 = true;
      $scope.loadingAlgo2 = true;
      $scope.loadingAlgo3 = true;
      $scope.loadingAlgo4 = true;

      $scope.weights = SlidersService.getWeightVectors();
    }
  );
