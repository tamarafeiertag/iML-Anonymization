'use strict';

describe('iMLApp.login module', function () {

  beforeEach(module('iMLApp.login'));

  describe('login controller', function () {

    it('should ....', inject(function ($controller, $rootScope) {
      //spec body
      var $scope = $rootScope.$new();
      var view1Ctrl = $controller('LoginCtrl', {$scope: $scope});
      expect(view1Ctrl).toBeDefined();
    }));

  });
});