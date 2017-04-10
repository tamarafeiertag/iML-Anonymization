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

        /*
         var strgh = $GH.IStringGenHierarchy;
         var contgh = $GH.IContGenHierarchy;
         var hierarchy = $GH.IStringGenHierarchy | $GH.IContGenHierarchy;
         var workclass_file = './assets/testdata/test_input/WorkClassGH.json';
         var sex_file = './assets/testdata/test_input/SexGH.json';
         var race_file = './assets/testdata/test_input/RaceGH.json';
         var marital_file = './assets/testdata/test_input/MaritalStatusGH.json';
         var nat_country_file = './assets/testdata/test_input/NativeCountryGH.json';
         var adults = './assets/testdata/test_input/adult_data.csv';
         */

        var adults = './assets/testdata/test_input/adult_data.csv';

        var weights = {
          'age': 0.95,
          'workclass': 0.01,
          'native-country': 0.01,
          'sex': 0.01,
          'race': 0.01,
          'marital-status': 0.1
        };

        var san = new anonymization.Algorithms.Sangreea("adults", adults, undefined, weights);

        console.log('test:', san);

      }
    }
  });
