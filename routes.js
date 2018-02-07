var http = require('http');
var url = require('url');
var express = require('express');
//var file = require('./middlewares/file-upload');
var excel = require('./middlewares/excel-processing');

app = express(); // Express instance created!

// Adding public folders
app.use("/js",  express.static(__dirname + '/public/js'));

// GET Requests
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/',function(req, res){
    time = Date.now().toString(); // What is time now?
//    file.upload_read(req, res, time);
    excel.read(time)
});