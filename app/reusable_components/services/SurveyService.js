(function () {
  'use strict';

  angular
    .module('iMLApp')
    .factory('SurveyService', SurveyService);

  SurveyService.$inject = ['$timeout', '$filter', '$q'];
  function SurveyService($timeout, $filter, $q) {

    var service = {};

    service.GetAll = GetAll;
    service.GetById = GetById;

    return service;

    function GetAll() {
      var deferred = $q.defer();
      deferred.resolve(getSurveys());
      return deferred.promise;
    }

    function GetById(id) {
      var deferred = $q.defer();
      var filtered = $filter('filter')(getSurveys(), { id: id });
      var user = filtered.length ? filtered[0] : null;
      deferred.resolve(user);
      return deferred.promise;
    }

    // private functions

    function getSurveys() {
      var surveys = [{sid:1, description:"Study regarding cancer development in the age group > 20"},
        {sid:2, description:"Hair loss study in consideration of all continents"},
        {sid:3, description:"Debility of sight in more evolved countries in europe"}];

      return surveys;
    }
  }
})();