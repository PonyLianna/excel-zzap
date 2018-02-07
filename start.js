var routes = require('./routes');
//// Dependencies specified
//var http = require('http');
//var url = require('url');
//var express = require('express');
////var xl = require('excel4node');
//var xlsx = require('xlsx');
//var multer = require('multer');
//
//var storage = multer.diskStorage({
//  destination: function (req, file, callback) {
//    callback(null, './uploads'); // Folder where you can find files
//  },
//  filename: function (req, file, callback) {
//    callback(null, time); // *TIME*.xls or *TIME*.xlsx
//  }
//});
//
//var upload = multer({ storage: storage }).single('excel');
//
//app = express(); // Express instance created!
//
//// Adding public folders
//app.use("/js",  express.static(__dirname + '/public/js'));
//
//// GET Requests
//app.get('/', function(req, res){
//    res.sendFile(__dirname + '/public/index.html');
//});
//
//app.post('/',function(req, res){
//    time = Date.now().toString(); // What is time now?
////    upload(req, res, function(err) {
////        if(err){
////            return res.end("Error uploading file.");
////        }
////        res.end("File is uploaded");
//    res.write('File is uploaded');
//    res.write('Such');
//    res.write('A');
//    res.end('Whau!');
////        excel = xlsx.readFile("./uploads/" + time);
////        console.log(excel);
////
////    });
//});

// Server Loop on entered port
app.listen("8080");
console.log("Run on 8080");
