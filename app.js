const express     = require('express');
const path        = require('path');
const fs          = require('fs');
const myParser    = require('body-parser');
const dateTime    = require('node-datetime');
const MongoClient = require('mongodb').MongoClient;
const db          = require('./config/db');

var app               = express();
var dt                = dateTime.create();
var formattedDateTime = dt.format('Y-m-d H:M:S');
var port              = 3000;


MongoClient.connect(db.url, (err, database) => {

  if (err) return console.log(err)
  require('./app/routes')(app, database);

  app.listen(port, () => {
    console.log('Listening on port: ' + port);
  });
})

app.use(myParser.json() );       // to support JSON-encoded bodies
app.use(myParser.urlencoded({extended: true})); // to support URL-encoded bodies
app.use(express.static(__dirname + '/public'));

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
