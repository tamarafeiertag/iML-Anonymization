angular.module('iMLApp.slider-learning', [])


.controller('SLCtrl',  ['$scope', '$location',
    function ($scope, $location) {

        $scope.learningContainerVisible = true;

        let pathParts = $location.$$path.split("/");
        $scope.currentSID = pathParts[pathParts.length - 1];

        console.log($scope.currentSID);


        $scope.redirectToSurvey = function(sid) {

            $location.path('/interactive-learning/'+ sid);
        };

    }


]);
