/**
 * Created by julian on 28.03.17.
 */

'use strict';

angular.module('iMLApp.servercom', [])

    .factory('ServerCom', function ($rootScope) {
        let socket = io.connect('http://servergraz.ddns.net:3000');
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    let args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            send: function (data, callback, eventName) {
                if(eventName === undefined)
                    eventName = "computeMLResults";

                socket.emit(eventName, data, function () {
                    let args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    });
