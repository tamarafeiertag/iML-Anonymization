'use strict';

angular.module('iMLApp.login.login-service', [])

  .service('LoginService', function () {
    return {
      getDegrees: function() {
        var degrees = [
        { id: 1, description: "Less than high school" },
        { id: 2, description: "High school diploma" },
        { id: 3, description: "College" },
        { id: 4, description: "Associate's degree" },
        { id: 5, description: "Bachelor's degree" },
        { id: 6, description: "Master's degree" },
        { id: 7, description: "Doctoral degree" }];

        return degrees;
      }
    }

  });