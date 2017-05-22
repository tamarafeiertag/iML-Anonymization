/*
 * Copyright (c) 2017
 * Feiertag Tamara, Waltl Christine, Wolf Julian
 */

'use strict';

angular.module('iMLApp.services.data-send-service',[])

  .factory('DataSendService', function($rootScope, SlidersService, SurveyService, ServerCom) {

    return {
      sendAnonymizationData: function(csvstring){
        let json_object = {};
        json_object.user = {};
        json_object.user.token = $rootScope.globals.currentUser.token;
        json_object.user.education = $rootScope.globals.currentUser.education;
        json_object.user.age = $rootScope.globals.currentUser.age;
        json_object.user.username = $rootScope.globals.currentUser.username;

        json_object.weights = {};
        json_object.weights = SlidersService.getJSONformattedWeightVectors();

        json_object.survey = SurveyService.GetCurrent();

        json_object.csvstring = csvstring;

        let json_string = JSON.stringify(json_object, null, 2);
        console.log(json_string);
        ServerCom.send(json_string, function (data) {
          console.log("successfully sent json file" + data);
        }, function (data) {
          console.log("fail sent json file" + data);
        })
      }

    };
  });

