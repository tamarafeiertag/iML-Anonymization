'use strict';

angular.module('iMLApp.survey-overview.survey-overview-controller', [])

  .controller('SurveyOverviewCtrl', function ($location, SurveyService, $scope, $state) {

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
          //FlashService.Success('Please click survey for participation!');
        });
    }

  $scope.redirectToSurvey = function(sid) {

    if(!SurveyService.SetId(sid))
      return;

    $state.go('slider-learning');
  };
});