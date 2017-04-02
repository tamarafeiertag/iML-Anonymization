/**
 * Created by julian on 28.03.17.
 */

'use strict';

angular.module('myApp.sliders', [])

    .service('slidersDatabase', function() {

        return {
            sliderGroups: {},
            sliders: {}
        }
    })
    .controller('SlidersCtrl',  ['$scope', 'slidersDatabase',
        function ($scope, slidersDatabase) {
            // observe changes in attribute - could also be scope.$watch
            $scope.sliderGroups = slidersDatabase.sliderGroups;
            $scope.sliders = slidersDatabase.sliders;

        }
    ])


    .directive('slider',  function() {

        return {
            replace: true,
            restrict: 'AE',
            link: function($scope, elem, attr, ctrl) {

                //WARNING: Do not change the order of the function declaration, otherwise the implementation does not work anymore

                /***
                 * Adjust all values of sliders including the oldValues in the given group. Does not check on to high or to low values.
                 * @param group The group object which contains the sliders
                 * @param newValue the value to be assigned
                 * @param relative if true, += is used
                 * @param exceptionList Which sliders should not be affected ( = [slider objects])
                 */
                $scope.changeValueOfAllSliders = function(group, newValue, relative, exceptionList) {

                    for(var sldrName in group) {
                        if (!group.hasOwnProperty(sldrName) || sldrName === "_length")
                            continue;

                        var sldr = group[sldrName];

                        if(exceptionList && exceptionList.indexOf(sldr) !== -1)
                            continue;

                        if(relative)
                            sldr.value += newValue;
                        else
                            sldr.value = newValue;

                        sldr.oldValue = sldr.value;
                    }
                };


                /***
                 * Gets called, if a slider got moved. Does all the leveling stuff.
                 * @param sliderId
                 */
                $scope.valueChanged = function (sliderId) {
                    var slider = $scope.sliders[sliderId];
                    var group = $scope.sliderGroups[slider.groupName];
                    var difference = slider.value - slider.oldValue;

                    $scope.changeValueOfAllSliders(group, - (difference / (group['_length'] - 1)), true, [slider]);

                    //now check the values of some sliders got out of range
                    var exceptionList = [slider];
                    var newDiff = 0;
                    for(var sliderName in group) {
                        if(! group.hasOwnProperty(sliderName) || sliderName === "_length")
                            continue;

                        var currSlider = group[sliderName];
                        //add to exception list, add his difference to diff and set to minimum
                        if(! currSlider.isChangeAble()) {
                            newDiff += currSlider.correctValue();
                            if(exceptionList.indexOf(currSlider) === -1)
                                exceptionList.push(currSlider);
                        }

                    }

                    $scope.changeValueOfAllSliders(group, newDiff / (group['_length'] - exceptionList.length), true, exceptionList);


                    //The slider changes the datatype to string, so we parse it back to float
                    slider.value = slider.oldValue = parseFloat(slider.value);
                };


                if(!attr.group)
                    attr.group = uuid();

                if(!$scope.sliderGroups[attr.group]) {
                    $scope.sliderGroups[attr.group] = {};
                    $scope.sliderGroups[attr.group]['_length'] = 0;
                }

                var i = 0;
                var checkName = attr.name;
                while($scope.sliderGroups[attr.group][checkName])
                    checkName = attr.name + (i++).toString();

                attr.name = checkName;
                $scope.attributes = attr;

                var lenGroup = $scope.sliderGroups[attr.group]['_length'];
                var value = 1 / (lenGroup + 1);

                var slider = {
                    name: attr.name,
                    groupName: attr.group,
                    id: guid(),
                    max: 1,
                    min: 0,
                    oldValue: value,
                    value: value,
                    /**
                     * Returns true, if the value of this slider is lower equal then its set minimum
                     * @returns {boolean}
                     */
                    isToLow: function() {
                        return this.value <= this.min;
                    },
                    /**
                     * Returns true, if the value of this slider is higher equal then its set maximum
                     * @returns {boolean}
                     */
                    isToHigh: function() {
                        return this.value >= this.max;
                    },
                    /**
                     * returns true, if the value is neither toHigh, nor toLow (see corresponding documentation)
                     * @returns {boolean}
                     */
                    isChangeAble: function() {
                        return ! (this.isToLow() || this.isToHigh());
                    },
                    /***
                     * Sets the value back to min or max if it was too low/high and returns the difference of the change (e.g. min = 0.5, value = 0.2, returns -0.3)
                     * @returns {number}
                     */
                    correctValue: function () {
                        var diff = 0;
                        if(this.isToLow()) {
                            diff = this.value - this.min;
                            this.oldValue = this.value = this.min;
                        } else if (this.isToHigh()) {
                            diff = this.value - this.max;
                            this.oldValue = this.value = this.max;
                        }
                        return diff;
                    }
                };

                $scope.sliderGroups[attr.group][attr.name] = slider;
                $scope.sliderGroups[attr.group]['_length']++;
                $scope.sliders[slider.id] = slider;

                $scope.changeValueOfAllSliders($scope.sliderGroups[attr.group], value);

            },
            templateUrl: 'components/sliders/sliders.html'
        }
    });

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}