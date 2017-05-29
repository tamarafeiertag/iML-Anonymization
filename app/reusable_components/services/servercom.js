/**
 * Created by julian on 28.03.17.
 */

'use strict';

angular.module('iMLApp.servercom', [])

    .factory('ServerCom', function ($rootScope) {
        let socket = null; //io.connect('http://servergraz.ddns.net:3000');
        return {
            /***
             * Socket listener registration, to handle it when server is yielding stuff
             * @param eventName the name of the event
             * @param callback the function to be called, takes 2 arguments: socket, data
             */
            on: function (eventName, callback) {
                return; //debug
                socket.on(eventName, function () {
                    let args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },

            /***
             * Send something via sockets
             * @param data The stuff to be sent
             * @param callback The callback of the send function, most time if something went wrong
             * @param eventName Optional, the name of the event which should be triggered at the server, default computeMLResults
             */
            send: function (data, callback, eventName) {
                return; //debug
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
            },

            /***
             * Sends a request via xhr (ajax)
             * @param data The data to be send *youdontsay*
             * @param onSuccessCallback I don't have to explain, what it is, you get that, right?!! Two Parameters: data, status
             * @param onErrorCallback same here... One parameter: data
             */
            sendXHR: function(data, onSuccessCallback, onErrorCallback) {


                $.ajax({
                    type: "POST",
                    url: "http://berndmalle.com:5000/anonML",
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8"
                    // dataType: "application/json; charset=utf-8"
                }).done((data, status, jqXHR) => {
                    onSuccessCallback(data, status);
                }).fail((data) => {
                    onErrorCallback(data);
                });


            }
        };
    });
