angular.module('iMLApp.slider-learning', [])


.controller('SLCtrl',
    function ($scope, $location) {

        $scope.learningContainerVisible = true;

        let pathParts = $location.$$path.split("/");
        $scope.currentSID = pathParts[pathParts.length - 1];

        $scope.redirectToSurvey = function(sid) {

            $location.path('/interactive-learning/'+ sid);
        };

    });

