/**
 * Created by julian on 28.03.17.
 */

'use strict';

angular.module('iMLApp.sliders', [])

    .service('slidersDatabase', function() {

        return {
            sliderGroups: {},
            sliders: {}
        };
    })
    .controller('SlidersCtrl',  ['$scope', 'slidersDatabase',
        function ($scope, slidersDatabase) {
            // observe changes in attribute - could also be scope.$watch

        }
    ])


    .directive('slidergroup',  ['slidersDatabase', function(sliderDB) {

        return {
            replace: true,
            restrict: 'AE',
            link: function($scope, elem, attr, ctrl) {

                //WARNING: Do not change the order of the function declaration, otherwise the implementation does not work anymore
                /***
                 * Adjust all values of sliders including the oldValues in the given groupname. Does not check on to high or to low values.
                 * @param group The groupname object which contains the sliders
                 * @param newValue the value to be assigned
                 * @param relative if true, += is used
                 * @param exceptionList Which sliders should not be affected ( = [slider objects])
                 */
                $scope.changeValueOfAllSliders = function(group, initPoolValue, exceptionList) {
                    let lclGroup = $.extend(true, {}, group);
                    let pool = initPoolValue;

                    while(pool != 0){
                        let singleVal = pool / (len(group) - len(exceptionList));

                        for()
                    }



                    group = lclGroup;
                };


                /***
                 * Gets called, if a slider got moved. Does all the leveling stuff.
                 * @param sliderId
                 */
                $scope.valueChanged = function (sliderId) {

                    var slider = sliderDB.sliders[sliderId];
                    var group = sliderDB.sliderGroups[slider.groupName];
                    var difference = slider.value - slider.oldValue;

                    $scope.changeValueOfAllSliders(group, -difference,  [slider]);

                    slider.value = slider.oldValue = parseFloat(slider.value);

                };


                if(!attr.groupname)
                    attr.groupname = guid();

                if(!sliderDB.sliderGroups[attr.groupname]) {
                    sliderDB.sliderGroups[attr.groupname] = {};
                    sliderDB.sliderGroups[attr.groupname]['_length'] = 0;
                }

                console.log(attr.slidernames, attr.slidernames.split(","));

                for(name in attr.slidernames.split(",")) {
                    attr.name = name.trim();
                    var i = 0;
                    var checkName = attr.name;
                    while (sliderDB.sliderGroups[attr.groupname][checkName])
                        checkName = attr.name + (i++).toString();

                    attr.name = checkName;
                    $scope.attributes = attr;

                    var lenGroup = sliderDB.sliderGroups[attr.groupname]['_length'];
                    var value = 1 / (lenGroup + 1);

                    var slider = {
                        name: attr.name,
                        groupName: attr.groupname,
                        id: guid(),
                        max: 1,
                        min: 0,
                        oldValue: value,
                        value: value,
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

                    sliderDB.sliderGroups[attr.groupname][attr.name] = slider;
                    sliderDB.sliderGroups[attr.groupname]['_length']++;
                    sliderDB.sliders[slider.id] = slider;

                    $scope.changeValueOfAllSliders(sliderDB.sliderGroups[attr.groupname], value);
                    $scope.sliders = sliderDB.sliders;
                    console.log('slider registered', sliderDB);
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