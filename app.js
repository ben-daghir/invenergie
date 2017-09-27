var express = require('express');
var fs = require('fs');
var myParser = require('body-parser');
var dateTime = require('node-datetime');
var app = express();


var dt = dateTime.create();
var formattedDateTime = dt.format('Y-m-d H:M:S');

app.use(myParser.json() );       // to support JSON-encoded bodies
app.use(myParser.urlencoded({extended: true})); // to support URL-encoded bodies

port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port)

app.get('/', function(req, res){
    console.log('Loading page...')
    //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
    var html = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
    console.log("Loaded");
});

app.post('/', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.body != null) {
        console.log("Successfully recieved data: " + formattedDateTime);
        res.end("Successfully recieved data: " + formattedDateTime);
    } else {
        console.log("Falied to recieve useful data.");
        res.end("Falied to recieve useful data.")
    }
});
