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
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,POST');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    console.log(request.method, ': ', request.url);

    request.on('data', function(data) {
        console.log(data);
        response.end("Got data");
    });
    response.end("Got request");
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
})
