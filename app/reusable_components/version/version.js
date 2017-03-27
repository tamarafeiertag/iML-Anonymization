'use strict';

angular.module('iMLApp.version', [
  'iMLApp.version.interpolate-filter',
  'iMLApp.version.version-directive'
])

.value('version', '0.1');
