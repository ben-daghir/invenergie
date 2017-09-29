var express = require('express');
var path = require('path');
var fs = require('fs');
var myParser = require('body-parser');
var dateTime = require('node-datetime');



var app = express();
var dt = dateTime.create();
var formattedDateTime = dt.format('Y-m-d H:M:S');

app.use(myParser.json() );       // to support JSON-encoded bodies
app.use(myParser.urlencoded({extended: true})); // to support URL-encoded bodies

port =  3000;
app.use(express.static(__dirname + '/public'));
app.listen(port, '0.0.0.0');
console.log('Listening at http://localhost:' + port)

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    res.writeHead(200, {'Content-Type': 'application/json'});
    if (req.body != null) {
        var temperature = req.body
        console.log("Successfully recieved data: " + formattedDateTime);
        res.end("Successfully recieved data: " + formattedDateTime);
    } else {
        console.log("Falied to recieve useful data.");
        res.end("Falied to recieve useful data.")
    }
});
