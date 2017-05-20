'use strict';

angular.module('iMLApp.login.login-service', [])

  .service('LoginService', function () {
    return {
      getDegrees: function() {
        var degrees = [
        { id: 1, description: 'secondary modern school' },
        { id: 2, description: 'Abitur' },
        { id: 3, description: 'Bachelor degree' },
        { id: 4, description: 'Master degree' },
        { id: 5, description: 'Doctoral degree' }];

        return degrees;
      }
    }

  });