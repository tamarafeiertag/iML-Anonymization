/**
 * Created by julian on 12.05.17.
 */

/**
 * DO NOT INCLUDE THIS FILE IN OUR ANGULARJS STUFF!
 *
 * This file is a server, run it with node[js] nodejs_testserver.js from commandline.
 * We have a cross orogin problem when communicating with different servers, thus, the testserver
 * has to run on the local machine.
 */

const http = require('http');
const port = 3000;

const requestHandler = (request, response) => {

    console.log(request.headers);
    if(request && request.headers && request.headers.origin)
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log(request.method, ': ', request.url);

    if (request.method === 'POST') {
        request.on('data', function(data) {
            console.log(JSON.parse(data.toString()));

        });
    }

    response.end(JSON.stringify({
        data: {

            0: 223.2,
            0.5: 125,
            1: 98.7,
            1.5: 86.3,
            2: 76.4,
            2.5: 46.7,
            3: 33.7
        }
    }));
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
})
