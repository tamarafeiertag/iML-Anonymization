angular.module('iMLApp.slider-learning', [])

.service('sliderLearningService', function() {
    return {
        fieldNames: ['age', 'education-num', 'hours-per-week', 'workclass', 'native-country', 'sex', 'race', 'relationship', 'occupation', 'income', 'marital-status'],
        
    };
})
.controller('SLCtrl',  ['$scope', 'sliderLearningService',
    function ($scope, sliderLearningService) {
        // observe changes in attribute - could also be scope.$watch

        $scope.learningContainerVisible = true;

        $scope.sliderNames = sliderLearningService.fieldNames;
        $scope.slidergroup = "learning";



    }
]);
