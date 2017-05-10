/**
 * Created by julian on 28.03.17.
 */

'use strict';

angular.module('myApp.server', [])

    .service('serverDatabase', function() {

        return {
            sliderGroups: {},
            sliders: {}
        };
    })
    .controller('ServerCtrl',  ['$scope', 'slidersDatabase',
        function ($scope, slidersDatabase) {

        return {
              send: function(data) {

              } ,
              test: function (){

              }
            };
        }
    ]);