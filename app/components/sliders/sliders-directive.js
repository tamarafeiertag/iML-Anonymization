'use strict';

angular.module('myApp.sliders.sliders-directive', [])

.directive('sliders', function() {

    return {
        templateURL: function (elem, attr) {

            if (!attr.amount)
                attr.amount = 2;

            if (!sliders)
                sliders = [];

            for (var i = 0; i < attr.amount; i++) {
                sliders += [{
                    id: guid(),
                    min: 0,
                    max: 1,
                    value: 1.0 / attr.amount
                }];
            }


            return 'sliders.html'
        }
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