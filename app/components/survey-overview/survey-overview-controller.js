'use strict';

angular.module('iMLApp.survey-overview.survey-overview-controller', [])

  .controller('SurveyOverviewCtrl', function ($location, SurveyService, $scope) {

    $scope.vm = this;
    $scope.vm.allSurveys = [];

    initController();

    function initController() {
      loadAllSurveys();
    }

    function loadAllSurveys() {
      SurveyService.GetAll()
        .then(function (surveys) {
          $scope.vm.allSurveys = surveys;
        });
    }

  $scope.redirectToSurvey = function(sid) {
    $location.path('/interactive-learning/'+ sid);
  };
  });