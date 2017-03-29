'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-service', [])

.service('ILService', function ($resource) {
  //use $resource later for retrieval from webservice


  return {
    getTestdata: function(callback) {
      var testdata = null;
      var TestdataResource = $resource('../assets/testdata/testdatarecords.json');
      TestdataResource.get({}, callback);
    },
    getMaritalStatusK2: function(callback) {
      var data = null;
      var dataResource = $resource('../assets/testdata/marital-status-k2.json');
      dataResource.get([], callback);
    }
  }
});
