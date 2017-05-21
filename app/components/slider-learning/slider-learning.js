angular.module('iMLApp.slider-learning', [])
  .service('SLService', function() {
    return {
        slidergroup: SlidersCtrl.$scope.sliderGroups['learning']
    };
  })

  .controller('SLCtrl', function ($scope, SlidersService, $location) {

    $scope.learningContainerVisible = true;

    //TODO Christine delete just test
    $scope.navigateToLearning = function () {
      SlidersService.getWeightVectors();

      SlidersService.getJSONformattedWeightVectors();

      $location.path('/interactive-learning');
    }

  });

