angular.module('iMLApp.slider-learning', [])
  .service('SLService', function() {
    return {
        slidergroup: SlidersCtrl.$scope.sliderGroups['learning']
    };
  })

  .controller('SLCtrl', function ($scope) {

    $scope.learningContainerVisible = true;

  });

