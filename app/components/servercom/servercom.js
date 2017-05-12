/**
 * Created by julian on 28.03.17.
 */

'use strict';

angular.module('myApp.servercom', [])

    .service('serverDatabase', function() {

        return {
            url: 'http://localhost:3000',
            method: 'POST'
        };
    })
    .controller('ServerCtrl',  ['$scope', '$http', 'serverDatabase',
        function ($scope, $http, serverDatabase) {
            $scope.send = function (data, onSuccess, onError) {
                if(serverDatabase.method === "POST")
                    $http.post(serverDatabase.url , data, {}).then(onSuccess, onError);
                else if(serverDatabase.method === "GET")
                    $http.get(serverDatabase.url, data, {}).then(onSuccess, onError);
                else
                    throw new Error("Unimplemented method: " + serverDatabase.method);
            };
            $scope.test = function (onSuccess, onError) {

            };
        }
    ]);