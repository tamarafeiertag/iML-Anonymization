/*
 * Copyright (c) 2017
 * Feiertag Tamara, Waltl Christine, Wolf Julian
 */

'use strict';

angular.module('iMLApp.services.data-send-service',[])

  .factory('DataSendService', function($rootScope, SlidersService, SurveyService, ServerCom, appConstants) {

    return {
      sendAnonymizationData: function(csvuser, csviml){
        let json_object = {};

        json_object.usertoken = $rootScope.globals.currentUser.usertoken;
        json_object.grouptoken = appConstants.GROUP_TOKEN;

        json_object.user = {};
        json_object.user.token = $rootScope.globals.currentUser.token;
        json_object.user.education = $rootScope.globals.currentUser.education.description;
        json_object.user.age = $rootScope.globals.currentUser.age;
        json_object.user.username = $rootScope.globals.currentUser.username;

        json_object.weights = {};
        json_object.weights = SlidersService.getJSONformattedWeightVectors();

        json_object.target = SurveyService.GetCurrent().target_column;

        json_object.csv = {bias: csvuser, iml: csviml};

        let json_string = JSON.stringify(json_object, null, 2);

        console.log(json_string);

        ServerCom.send(json_string, function (data) {
          console.log("got callback on send", data);
        });
      }

    };
  });

