var http = require('http');
var fs = require('fs');
var url = require('url');
var sql = require('mssql/msnodesqlv8');

const ourConfig = {
    server: "SQLEXPRESS",
    database: "school",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
};

var executeMultipleQuery = function (res, myquery) {

    sql.connect(ourConfig, function (err) {
        if (err) console.log(err);
        // create Request object

        var connection = new sql.Connection(ourConfig);
        connection.connect();
        var request = new sql.Request(connection);

        // query to the database and get the records
        request.query(myquery, function (err, data) {
            if (err) {
                console.log(err);
                res.writeHead(501, { 'Content-Type': 'text/html' });
                res.write(err)
                res.end();
            }
            // send records as a response
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(("got response from sql server.", data));
                res.end();
            }
        });
    });
};

function readFile(filename, res) {
    fs.readFile(filename, function (error, data) {
        if (error) {
            throw error;
        } else {

            if (filename === 'not-found.html') {
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
    } else if (pagename === '/person/insert') { // locahost:3000/person/insert

        var bodyData = '';
        req.on('data', function (chunk) {
            bodyData = bodyData + chunk.toString();
        });

        req.on('end', function () {
            const person = JSON.parse(bodyData);
            var str = "insert into person(firstName, lastName, Address, Phone, Email) values('" +
                person.firstName + "' , '" + person.lastName + "' , '" + person.address + "' ,'" +
                person.phone + "' ,'" + person.email + "'  );";

            executeMultipleQuery(res, str);

        });


    } else {
        readFile('not-found.html', res);
    }
});
myServer.listen(3000);

console.log('my server is listening at port 3000');
console.log('please access the server from http://localhost:3000/')