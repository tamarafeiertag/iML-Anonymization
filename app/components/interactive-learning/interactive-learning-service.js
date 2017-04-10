'use strict';


let anonymization = require('anonymiationjs').$G;


angular.module('iMLApp.interactive-learning.interactive-learning-service', [])

  .factory('ILService', function ($resource) {
    //use $resource later for retrieval from webservice

    let dataResource = $resource('assets/testdata/marital-status-k2.json');
    let data = dataResource.query();

    return {
      getTestdata: function (callback) {
        let TestdataResource = $resource('assets/testdata/testdatarecords.json');
        TestdataResource.get(callback);
      },
      getMaritalStatusK2: function () {
        return data.$promise;
      },
      getAnonymizationRecords: function () {

         let adults = './assets/testdata/test_input/adult_data.csv';

          let weights = {
              'age': 0.95,
              'workclass': 0.01,
              'native-country': 0.01,
              'sex': 0.01,
              'race': 0.01,
              'marital-status': 0.1
          };

          let san = new anonymization.Algorithms.Sangreea("adults", adults, undefined, weights);
          san.instantiateGraph();
          san.anonymizeGraph(10);



      }
    }
  });
