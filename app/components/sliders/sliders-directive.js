'use strict';

angular.module('myApp.sliders.sliders-directive', [])

.directive('slider', function() {

    return {
        replace: true,
        restrict: 'AE',
        link: function($scope, elem, attr, ctrl) {
            console.debug($scope);
            console.debug(ctrl);

            if(!attr.group)
              attr.group = uuid();

            if(!$scope.sliderGroups[attr.group])
                $scope.sliderGroups[attr.group] = {};


            var i = 0;
            var checkName = attr.name;
            while($scope.sliderGroups[attr.group][checkName])
              checkName = attr.name + (i++).toString();

            attr.name = checkName;


            $scope.slider = {
              name: attr.name,
              groupName: attr.group,
              id: guid(),
              max: 1,
              min: 0,
              value: (attr.value ? attr.value : 0)
            };

            $scope.sliderGroups[attr.group][attr.name] = slider;
            $scope.sliders[$scope.slider.id] = $scope.slider;


            $scope.$watch('myModel', function() {  }, true);
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