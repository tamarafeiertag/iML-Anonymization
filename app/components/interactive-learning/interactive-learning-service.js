/* browserify interactive-learning-service.js -o interactive-learning-service-bundle.js */

'use strict';

var anonymization = require('anonymiationjs').$G;

angular.module('iMLApp.interactive-learning.interactive-learning-service', [])

  .factory('ILService', function ($resource) {
    //use $resource later for retrieval from webservice

    var dataResource = $resource('assets/testdata/marital-status-k2.json');
    var data = dataResource.query();

    return {
      getTestdata: function (callback) {
        var TestdataResource = $resource('assets/testdata/testdatarecords.json');
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


          window.fs.readFileSync = function(filename) {
            let xhr = new XMLHttpRequest();
              return xhr.open("GET", filename, true);
          };


          let san = new anonymization.Algorithms.Sangreea("adults", adults, undefined, weights);

          console.log('sa:', san);
          san.instantiateGraph();
          san.anonymizeGraph(10);

          // let anonymizedOutfileRace = "race_weights_" + (+new Date()).toString();
          // san.outputAnonymizedCSV(anonymizedOutfileRace);
          // expect(san._graph.nrNodes()).to.equal(300);

      }
    }
  });
