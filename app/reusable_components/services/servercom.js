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

                let bernddata = {
                    "grouptoken": "string",
                    "usertoken": "string",
                    "weights": {
                        "bias": {
                            "age": 0.37931034482758613,
                            "education-num": 0.0689655172413793,
                            "hours-per-week": 0.0689655172413793,
                            "workclass": 0.0689655172413793,
                            "native-country": 0.0689655172413793,
                            "sex": 0.0689655172413793,
                            "race": 0.0689655172413793,
                            "relationship": 0.0689655172413793,
                            "occupation": 0.0689655172413793,
                            "marital-status": 0.0689655172413793
                        },
                        "iml": {
                            "age": 0.13704865909390093,
                            "education-num": 0.14385388791553647,
                            "hours-per-week": 0.1279067106608888,
                            "workclass": 0.11057201781371723,
                            "native-country": 0.11958109916626228,
                            "sex": 0.0958123676325629,
                            "race": 0.12552706039834438,
                            "relationship": 0.074162197318787,
                            "occupation": 0.032768000000000005,
                            "marital-status": 0.032768000000000005
                        }
                    },
                    "csv": {
                        "bias": data.csv.bias,
                        "iml": data.csv.iml
                    },
                    "target": data.target,
                    // ===== OPTIONAL =====
                    "user": {
                        "token": "NjY6W29iamVjdCBPYmplY3RdOjE0OTU0NDI1NTI4MDk6dW5kZWZpbmVk",
                        "education": {
                            "id": 1,
                            "description": "secondary modern school"
                        },
                        "age": 66,
                        "username": "Anonym"
                    },
                    "survey": {
                        "sid": 2,
                        "target_column": "income",
                    }
                };

                data.csv = bernddata.csv;

                if(! typeof data === "string")
                    data = JSON.stringify(data);


                $.ajax({
                    type: "POST",
                    url: "http://berndmalle.com:5000/anonML",
                    data: data,
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
