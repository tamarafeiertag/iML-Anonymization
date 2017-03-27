'use strict';

describe('iMLApp.version module', function() {
  beforeEach(module('iMLApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
