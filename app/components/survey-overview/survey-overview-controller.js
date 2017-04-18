'use strict';

angular.module('iMLApp.survey-overview.survey-overview-controller', [])

  .controller('SurveyOverviewCtrl', function ($scope, $location) {

  $scope.surveys = [{sid:1, description:"Tami is a pro schubidubi. And she is also very hungry :)"},
    {sid:2, description:"Julian is a pro dadudidelei. He eats tamaras food"},
    {sid:3, description:"Christine is present in this group."}];

  $scope.redirectToSurvey = function(sid) {
    $location.path('/interactive-learning/'+ sid);
  };
  });