angular.module('iMLApp.slider-learning', [])
.controller('SLCtrl', function ($scope, SurveyService) {

    let currSurv = SurveyService.GetCurrent();

    if(currSurv) {
        $scope.columns = ["age", "education-num", "hours-per-week", "workclass", "native-country", "sex", "race", "relationship", "occupation", "income", "marital-status"];
        $scope.target_column = currSurv.target_column;

        console.log(currSurv.target_column);

        let index = $scope.columns.indexOf($scope.target_column);


        if(index > -1)
          $scope.columns.splice(index, 1);

        $scope.columnString = $scope.columns.join(",");
    }

});

