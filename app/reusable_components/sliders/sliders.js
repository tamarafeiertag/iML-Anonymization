/**
 * Created by julian on 28.03.17.
 */

'use strict';

angular.module('iMLApp.sliders', [])
  .service('SlidersService', function(anonymizationConfig) {
      return {
        sliderGroups: {},
        sliders: {},

        getWeightVectors: function() {
          var weights = {};

          for (let slider in this.sliderGroups.learning) {
            if (!this.sliderGroups.learning.hasOwnProperty(slider) || slider.startsWith("_"))
              continue;

            let name = slider;
            let value = this.sliderGroups.learning[name].value;

            weights[name] = {name: name, user: value, iml: 0};
          }

          let cats = anonymizationConfig.GEN_WEIGHT_VECTORS[anonymizationConfig.VECTOR].categorical;
          let ranges = anonymizationConfig.GEN_WEIGHT_VECTORS[anonymizationConfig.VECTOR].range;

          for (let weight in cats) {
            if (!cats.hasOwnProperty(weight))
              continue;

            let name = weight;
            let value = cats[weight];
            weights[name].iml = value;
          }

          for (let weight in ranges) {
            if (!ranges.hasOwnProperty(weight))
              continue;

            let name = weight;
            let value = ranges[weight];
            weights[name].iml = value;
          }

          return weights;
        },

        getJSONformattedWeightVectors : function () {
          var weights = this.getWeightVectors();

          var json_weights = {};
          json_weights.user = {};
          json_weights.iml = {};

          for (let weight in weights) {
            var var_name = weight;
            json_weights.user[var_name] = weights[weight].user;
            json_weights.iml[var_name] = weights[weight].iml;
          }

          return json_weights;
        }
      };
  })
    .controller('SlidersCtrl',  ['$scope', 'SlidersService',
        function ($scope, SlidersService) {
            // observe changes in attribute - could also be scope.$watch
            $scope.sliderGroups = SlidersService.sliderGroups;
            $scope.sliders = SlidersService.sliders;
        }
    ])


    .directive('slidergroup',  [  function($scope) {

        return {
            replace: true,
            restrict: 'AE',
            link: function($scope, elem, attr, ctrl) {

                //WARNING: Do not change the order of the function declaration, otherwise the implementation does not work anymore
                /***
                 * Adjust all values of sliders including the oldValues in the given groupname. Does not check on to high or to low values.
                 * @param group The group object which contains the sliders
                 * @param changeDifference the negative value of the change of the one slider which got changed
                 * @param userInput sets all userInput values, to show them correctly on the HTML. Does no calculation
                 */
                $scope.changeValueOfAllSliders = function(group, changeDifference, userInput) {

                    //avoid watch reaction to our changes

                    if(userInput) { //initial set
                        if(!changeDifference)
                            return;

                        for(let name in group) {
                            if(name.startsWith("_"))
                                continue;

                            group[name].userInput = parseFloat(changeDifference) / parseFloat(group._length);
                        }

                        return;
                    }

                    let sum = 0;
                    for(let name in group) {
                        if(name.startsWith("_"))
                            continue;

                        sum += group[name].userInput;
                    }

                    for(let name in group) {
                        if(name.startsWith("_"))
                            continue;

                        group[name].value = group[name].userInput / sum;
                    }


                };


                /***
                 * Gets called, if a slider got moved. Does all the leveling stuff.
                 * @param sliderId
                 */
                $scope.valueChanged = function (sliderId) {
                    var slider = $scope.sliders[sliderId];
                    var group = $scope.sliderGroups[slider.groupName];
                    $scope.changeValueOfAllSliders(group);
                };

                /**************************************************************************************
                 * CREATE THE SLIDERS
                 */
                if(!attr.groupname)
                    attr.groupname = guid();

                if(!$scope.sliderGroups[attr.groupname]) {
                    $scope.sliderGroups[attr.groupname] = {};
                    $scope.sliderGroups[attr.groupname]['_length'] = 0;
                }


                for(name of attr.slidernames.split(",")) {
                    attr.name = name.trim();
                    var i = 0;
                    var checkName = attr.name;
                    while ($scope.sliderGroups[attr.groupname][checkName])
                        checkName = attr.name + (i++).toString();

                    attr.name = checkName;
                    $scope.attributes = attr;

                    var lenGroup = $scope.sliderGroups[attr.groupname]['_length'];
                    var value = 1 / (lenGroup + 1);
                    var slider = {
                        name: attr.name,
                        noTextBox: parseInt(attr.notextbox),
                        groupName: attr.groupname,
                        id: guid(),
                        max: 1.0,
                        min: 0.0,
                        oldValue: value,
                        value: value,
                        userInput: value,
                        /**
                         * Returns true, if the value of this slider is lower equal then its set minimum
                         * @returns {boolean}
                         */
                        isToLow: function () {
                            return this.value <= this.min;
                        },
                        /**
                         * Returns true, if the value of this slider is higher equal then its set maximum
                         * @returns {boolean}
                         */
                        isToHigh: function () {
                            return this.value >= this.max;
                        },
                        /**
                         * returns true, if the value is neither toHigh, nor toLow (see corresponding documentation)
                         * @returns {boolean}
                         */
                        isChangeAble: function () {
                            return !(this.isToLow() || this.isToHigh());
                        },
                        /***
                         * Sets the value back to min or max if it was too low/high and returns the difference of the change (e.g. min = 0.5, value = 0.2, returns -0.3)
                         * @returns {number}
                         */
                        correctValue: function () {
                            var diff = 0;
                            if (this.isToLow()) {
                                diff = this.value - this.min;
                                this.oldValue = this.value = this.min;
                            } else if (this.isToHigh()) {
                                diff = this.value - this.max;
                                this.oldValue = this.value = this.max;
                            }
                            return diff;
                        }
                    };

                    $scope.sliderGroups[attr.groupname][attr.name] = slider;
                    $scope.sliderGroups[attr.groupname]['_length']++;
                    $scope.sliders[slider.id] = slider;

                    $scope.changeValueOfAllSliders($scope.sliderGroups[attr.groupname], 1.0, true);
                }

            },
            templateUrl: 'reusable_components/sliders/sliders.html'

        };
    }]);

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}