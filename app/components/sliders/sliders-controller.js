'use strict';

angular.module('myApp.sliders.sliders-controller', [])

    .controller('SlidersCtrl',  ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
            // observe changes in attribute - could also be scope.$watch
            $scope.sliderGroups = {};
            $scope.sliders = {};

        }
    ]
    );/**
 * Created by julian on 30.03.17.
 */


