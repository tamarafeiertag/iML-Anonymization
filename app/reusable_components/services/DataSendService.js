'use strict';

angular.module('iMLApp.services.data-send-service',[])

  .factory('DataSendService', function($rootScope, SlidersService, SurveyService) {

    return {
      sendAnonymizationData: function(csvstring){
        var json_object = {};
        json_object.user = {};
        json_object.user.token = $rootScope.globals.currentUser.token;
        json_object.user.education = $rootScope.globals.currentUser.education;
        json_object.user.age = $rootScope.globals.currentUser.age;
        json_object.user.username = $rootScope.globals.currentUser.username;

        json_object.weights = {};
        json_object.weights = SlidersService.getJSONformattedWeightVectors();

        json_object.survey_id = SurveyService.GetCurrent();

        json_object.csvstring = csvstring;

        console.log(JSON.stringify(json_object, null, 2));
      }

    };
  });

