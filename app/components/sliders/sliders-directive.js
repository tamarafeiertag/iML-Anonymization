'use strict';

angular.module('myApp.sliders.sliders-directive', [])

.directive('sliders', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
});
