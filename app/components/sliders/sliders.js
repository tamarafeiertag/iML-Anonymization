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

                /***
                 * Adjust all values of sliders including the oldValues in the given group. Does not check on to high or to low values.
                 * @param group The group object which contains the sliders
                 * @param newValue the value to be assigned
                 * @param relative if true, += is used
                 * @param exceptionList Which sliders should not be affected ( = [slider objects])
                 */
                $scope.changeValueOfAllSliders = function(group, newValue, relative, exceptionList) {
                    console.log(group);
                    for(var sldrName in group) {
                        if (!group.hasOwnProperty(sldrName) || sldrName === "_length")
                            continue;

                        var sldr = group[sldrName];
                        console.log(sldr, newValue);

                        if(exceptionList && exceptionList.indexOf(sldr) !== -1)
                            continue;

                        if(relative)
                            sldr.value += newValue;
                        else
                            sldr.value = newValue;

                        sldr.oldValue = sldr.value;
                    }
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
                    drawn: 0
                };

                $scope.sliderGroups[attr.group][attr.name] = slider;
                $scope.sliderGroups[attr.group]['_length']++;
                $scope.sliders[slider.id] = slider;

                $scope.changeValueOfAllSliders($scope.sliderGroups[attr.group], value);

                $scope.valueChanged = function (sliderId) {
                    console.log("Slider changed");

                    var slider = $scope.sliders[sliderId];
                    var group = $scope.sliderGroups[slider.groupName];

                    var difference = slider.value - slider.oldValue;

                    $scope.changeValueOfAllSliders(group, - (difference / (group['_length'] - 1)), true, [slider]);


                    //now check the values if one got out of range
                    var doCheck = 1;
                    while(doCheck) {
                        doCheck = 0;
                        for(var name in group){
                            if(! group.hasOwnProperty(name) || name == "_length")
                                continue;

                            var sldr = group[name];

                            if(sldr.value < sldr.min) {
                                doCheck = 1; // we change something, so we need to check again
                                //TODO: CHeck if grouplength  - 2 == 0 !
                                $scope.changeValueOfAllSliders(group, -(sldr.min - sldr.value) / (group['_length'] - 2), true, [slider, sldr] );
                                sldr.oldValue = sldr.value = sldr.min;
                            } else if(sldr.value > sldr.max) {
                                doCheck = 1; // we change something, so we need to check again
                                //TODO: CHeck if grouplength  - 2 == 0 !
                                $scope.changeValueOfAllSliders(group, (sldr.value - sldr.max ) / (group['_length'] - 2), true, [slider, sldr] );
                                sldr.oldValue = sldr.value = sldr.max;
                            }
                        }



                    }


                    slider.oldValue = slider.value;
                    slider.value = slider.oldValue = parseFloat(slider.value);

                }
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