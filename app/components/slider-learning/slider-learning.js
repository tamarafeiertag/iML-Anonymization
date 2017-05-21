angular.module('iMLApp.slider-learning', [])
.controller('SLCtrl', function ($scope, SurveyService) {

    $scope.columns = SurveyService.GetVisibleColumnNames();
    $scope.target_column = SurveyService.GetCurrent().target_column;

    if($scope.columns !== undefined) {
        $scope.columnString = $scope.columns.join(",");
    }

    console.log($scope);
});

