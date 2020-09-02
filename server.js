var http = require('http');
var fs = require('fs');
var url = require('url');


function readFile(filename, res) {
    fs.readFile(filename, function (error, data) {
        if (error) {
            throw error;
        } else {

            if(filename === 'not-found.html') {
                res.writeHead(400, { 'Content-Type': 'text/html' });
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
            }

            res.write(data);
            res.end();
        } 
    });
}

var myServer = http.createServer(function (req, res) {
    var pagename = url.parse(req.url, true).pathname;
    // path name aap ko page name bata ta ha.
    // /about, /contactus, /person/insert

    if (pagename === '/') { //localhost:3000
        readFile('home.html', res);
    } else if (pagename === '/contactus') { // locahost:3000/about
        readFile('contactus.html', res);
    } else if (pagename === '/about') { // locahost:3000/about
        readFile('about.html', res);
    } else if (pagename === '/person/insert') { // locahost:3000/about
        var queryStringData = url.parse(req.url, true).query;
        console.log('query string data:', queryStringData);

        // req.method === 'PUT'
        var bodyData = '';
        req.on('data', function(chunk) {
            bodyData = bodyData + chunk.toString();
        });

        req.on('end', function() {
            console.log('json data from body', bodyData);
            // now you can insert this data in database.
            // insert into person(first...) value(...);

            res.writeHead(200, { 'content-type': 'application/json'});
            res.write(bodyData);
            res.end();
        });


    } else { 
        readFile('not-found.html', res);
    }
});
myServer.listen(3000);

console.log('my server is listening at port 3000');
console.log('please access the server from http://localhost:3000/')