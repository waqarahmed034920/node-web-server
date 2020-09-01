var http = require('http');
var fs = require('fs');

function readFile(filename, res) {
    fs.readFile(filename, function (error, data) {
        if (error) {
            throw error;
        } else if (filename) {
             {
                 res.writeHead(400,{'Content-Type': 'text/html'});
             }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        } 
    });
}

var myServer = http.createServer(function (req, res) {

    if (req.url === '/') { //localhost:3000
        readFile('home.html', res);
    } else if (req.url === '/contactus') { // locahost:3000/about
        readFile('contactus.html', res);
    } else if (req.url === '/about') { // locahost:3000/about
        readFile('about.html', res);
    } else { 
        readFile('not-found.html', res);
    }
});
myServer.listen(3000);

console.log('my server is listening at port 3000');