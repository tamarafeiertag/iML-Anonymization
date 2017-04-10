/* browserify interactive-learning-service.js -o interactive-learning-service-bundle.js */

'use strict';

var anonymization = require('anonymiationjs');

angular.module('iMLApp.interactive-learning.interactive-learning-service', [])

.factory('ILService', function ($resource) {
  //use $resource later for retrieval from webservice

  var dataResource = $resource('assets/testdata/marital-status-k2.json');
  var data = dataResource.query();

  return {
    getTestdata: function(callback) {
      var TestdataResource = $resource('assets/testdata/testdatarecords.json');
      TestdataResource.get(callback);
    },
    getMaritalStatusK2: function() {
      return data.$promise;
    }
  }
});
