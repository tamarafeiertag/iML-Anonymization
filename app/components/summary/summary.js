'use strict';

angular.module('iMLApp.summary', [])


.controller('SummaryCtrl',  ['$scope', '$location', 'SlidersService', 'anonymizationConfig',
    function ($scope, $location, SlidersService, anonymizationConfig) {
        $scope.loadingAlgo1 = true;
        $scope.loadingAlgo2 = true;
        $scope.loadingAlgo3 = true;
        $scope.loadingAlgo4 = true;

        $scope.weights = {};

        console.log(SlidersService);
        for(let slider in SlidersService.sliderGroups.learning) {
            if(! SlidersService.sliderGroups.learning.hasOwnProperty(slider) || slider.startsWith("_"))
                continue;

            let name = slider;
            let value = SlidersService.sliderGroups.learning[name].value;

            $scope.weights[name] = {name: name, user: value, iml: 0};
        }

        let cats = anonymizationConfig.GEN_WEIGHT_VECTORS[anonymizationConfig.VECTOR].categorical;
        let ranges = anonymizationConfig.GEN_WEIGHT_VECTORS[anonymizationConfig.VECTOR].range;

        for(let weight in cats) {
            if(! cats.hasOwnProperty(weight))
                continue;

            let name= weight;
            let value = cats[weight];
            $scope.weights[name].iml = value;
        }

      for(let weight in ranges) {
        if(! ranges.hasOwnProperty(weight))
          continue;

        let name= weight;
        let value = ranges[weight];
        $scope.weights[name].iml = value;
      }

        console.log($scope.weights);


    }


]);
