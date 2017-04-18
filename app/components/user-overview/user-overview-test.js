'use strict';

describe('iMLApp.user-overview module', function () {

  beforeEach(module('iMLApp.user-overview'));

  describe('user-overview controller', function () {

    it('should ....', inject(function ($controller, $rootScope) {
      //spec body
      var $scope = $rootScope.$new();
      var view1Ctrl = $controller('UserOverviewCtrl', {$scope: $scope});
      expect(view1Ctrl).toBeDefined();
    }));

  });
});