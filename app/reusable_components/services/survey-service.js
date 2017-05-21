/*
 * Copyright (c) 2017
 * Feiertag Tamara, Waltl Christine, Wolf Julian
 */
'use strict';

angular.module('iMLApp.services.survey-service',[])

  .factory('SurveyService', function($timeout, $filter, $q) {

    return {

      currentID: 1,

      surveys: {
        1: {sid:1, description:"Marital Status", target_column: "marital-status", remote_target: "marital-status",
            equal_weights: {
              'categorical': {
                'workclass': 1/10.0,
                  'native-country': 1/10.0,
                  'sex': 1/10.0,
                  'race': 1/10.0,
                  'relationship': 1/10.0,
                  'occupation': 1/10.0,
                  'income': 1/10.0
              },
              'range': {
                'age': 1/10.0,
                  'hours-per-week': 1/10.0,
                  'education-num': 1/10.0
              }
            }
          },
        2: {sid:2, description:"Income", target_column: "income", remote_target: "income",
          equal_weights: {
            'categorical': {
              'workclass': 1/10.0,
              'native-country': 1/10.0,
              'sex': 1/10.0,
              'race': 1/10.0,
              'relationship': 1/10.0,
              'occupation': 1/10.0,
              'marital-status': 1/10.0
            },
            'range': {
              'age': 1/10.0,
              'hours-per-week': 1/10.0,
              'education-num': 1/10.0
            }
          }
        },
        3: {sid:3, description:"Education", target_column: "education-num", remote_target: "education",
          equal_weights: {
            'categorical': {
              'workclass': 1/10.0,
              'native-country': 1/10.0,
              'sex': 1/10.0,
              'race': 1/10.0,
              'relationship': 1/10.0,
              'occupation': 1/10.0,
              'income': 1/10.0,
              'marital-status': 1/10.0
            },
            'range': {
              'age': 1/10.0,
              'hours-per-week': 1/10.0,
            }
          }
        }
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
        //console.log(this.currentID);
        return this.surveys[this.currentID];
      },


      SetId: function(id) {
        if(this.surveys.hasOwnProperty(id)) {
          this.currentID = id;
          return true;
        } else {
          return false;
        }
      },

      GetVisibleColumnNames: function () {

        if (!this.GetCurrent())
          return undefined;

        let columns = ["age", "education-num", "hours-per-week", "workclass", "native-country", "sex", "race",
          "relationship", "occupation", "income", "marital-status"];

        let target_column = this.GetCurrent().target_column;

        let index = columns.indexOf(target_column);

        if(index > -1)
          columns.splice(index, 1);

        return columns;
      }

    };
  });
