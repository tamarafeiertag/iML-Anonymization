'use strict';

describe('iMLApp.survey-overview module', function () {

  beforeEach(module('iMLApp.survey-overview'));

  describe('survey-overview controller', function () {

    it('should ....', inject(function ($controller, $rootScope) {
      //spec body
      var $scope = $rootScope.$new();
      var view1Ctrl = $controller('SurveyOverviewCtrl', {$scope: $scope});
      expect(view1Ctrl).toBeDefined();
    }));

  });
});