var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('demodb02');
var gameData = "hello world"
var fs = require('fs')

  xml2js = require('xml2js');



var parseString = require('xml2js').parseString;
var xml = "<root>Hello xml2js!</root>"
parseString(xml, function (err, result) {
    console.dir(result);
});

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/static.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result);
        console.log('Done');
    });
});

fs.readFile("static.xml", 'utf8', function(err, data){
	if (err) throw err
	console.log('OK: ' + "static.xml");
	console.log(data)
	gameData = data
})
 
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value INTEGER)");
    db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);
});
 
 
 
var express = require('express');
var restapi = express();
 
 restapi.get('/game-static', function(req, res){
    
        res.send(gameData);
    });
 
restapi.get('/data', function(req, res){
    db.get("SELECT value FROM counts", function(err, row){
        res.json({ "count" : row.value });
    });
});
 
restapi.post('/data', function(req, res){
    db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", function(err, row){
        if (err){
            console.err(err);
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
});
 
 
restapi.listen(3000);
 
console.log("Submit GET or POST to http://localhost:3000/data");