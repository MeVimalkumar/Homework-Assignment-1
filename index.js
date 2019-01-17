// Declare variables
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Create server
const server = http.createServer((req, res) => {

    // Get the URL and parse it
    let parsedUrl = url.parse(req.url, true);

    // Get the path
    let path = parsedUrl.pathname
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    let queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    let method = req.method.toLowerCase();

    // Get the headers as an object
    let headers = req.headers;

    // Get the payload as an object
    let decoder = new StringDecoder('utf-8');
    let buffer = "";
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handler this request should go to, if one is not found, use the not found handler
        let chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code calledback by the handler, or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Use the payload calledback by the handle, default to empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert the payload to a string
            let payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request pth
            console.log('Returning this response: ', statusCode, payloadString);

        });
    });

});

// Start the server
server.listen(config.port, () => {
    console.log(config.envName + ' Server listing on ' + config.port);
});

// Define the handlers
let handlers = {};

// hello handler
handlers.hello = (data, callback) => {
    // Callback a http status code, and a payload object
    callback(406, { 'message': 'Hello World!!!' });
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

// Define a request router
let router = {
    'hello': handlers.hello
};
