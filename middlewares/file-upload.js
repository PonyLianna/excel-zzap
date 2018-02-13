var multer = require('multer');
var excel = require('./excel-processing');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads'); // Folder where you can find files
    },
    filename: function (req, file, callback) {
        callback(null, time + ".xls"); // *TIME*.xls or *TIME*.xlsx
    }
});

var upload = multer({storage: storage}).single('excel');

exports.upload_read = function (req, res, time) {
    upload(req, res, function (err) {
        if (err) {
            console.log('Error uploading file');
            return res.end("Error uploading file.");
        }
        console.log('File is uploaded');
        excel.read(time);
    });

};

