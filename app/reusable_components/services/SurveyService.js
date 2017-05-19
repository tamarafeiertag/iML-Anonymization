'use strict';

angular.module('iMLApp.services.survey-service',[])

  .factory('SurveyService', function($timeout, $filter, $q) {

    return {

      currentID: 1,

      surveys: {
        1: {sid:1, description:"Marital Status", target_column: "marital-status", remote_target: "marital-status"},
        2: {sid:2, description:"Income", target_column: "income", remote_target: "income"},
        3: {sid:3, description:"Education", target_column: "education-num", remote_target: "education"}
      },

      GetAll: function(){
        var deferred = $q.defer();
        deferred.resolve(this.GetSurveys());
        return deferred.promise;
      },

      GetSurveys: function() {
        return this.surveys;
      },

      GetById: function(id) {
        if(this.surveys.hasOwnProperty(id))
          return this.surveys[id];
        else
          return undefined;

      },

      GetCurrent: function (){
        return this.surveys[this.currentID];
      },


      SetId: function(id) {
        if(this.surveys.hasOwnProperty(id)) {
          this.currentID = id;
          return true;
        } else {
          return false;
        }
      }

    };
  });
