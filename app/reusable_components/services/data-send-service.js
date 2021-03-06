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
        json_object.survey = {
          "sid": SurveyService.GetCurrent().sid,
          "target_column": SurveyService.GetCurrent().target_column
        };

        json_object.csv = {bias: csvuser, iml: csviml};


        console.log(json_object);

        ServerCom.sendXHR(json_object, function (data) {
            console.log("SUCCESS result from server:");
            console.log(data);

            if(typeof data === "string")
                data = JSON.parse(data);

            //document.querySelector("#results_json").innerHTML = JSON.stringify(result_obj, undefined, 2);
            document.querySelector("#imgAlgo1").innerHTML = '<img src="' + data.plotURL + '" alt="algorithm img" />';
            //document.querySelector("#progress-bar-outer").style = "display: none;";
            //document.querySelector("#progress-update").style = "display: none;";
        }, function(data) {
          console.log("error while sending data to server:", data);
        });
      }

    };
  });

