/**
 * Created by julian on 28.03.17.
 */

'use strict';

angular.module('myApp.servercom', [])

    .service('ServerCom', function() {

        return {
            send: function (data, onSuccess, onError) {

                let config= {
                    url: 'http://servergraz.ddns.net:3000',
                        method: 'POST',
                    config: {
                        headers: {
                            'Content-Type': 'application/json'}
                    }
                };

                if(serverDatabase.method === "POST")
                    $http.post(config.url , data, config.config).then(onSuccess, onError);
                else
                    throw new Error("Unimplemented method: " + serverDatabase.method + "; Reason: 'cause F*** you, that's why!");
            }
        };
    });