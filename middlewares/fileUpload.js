const multer = require('multer');
const excel = require('./excelProcessing');

exports.readExcel = function (req, res) { //, time
    return new Promise((resolve, reject) => {
        const name = 'main.xls';
        let storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './uploads'); // Folder where you can find files
            },
            filename: function (req, file, callback) {
                callback(null, name); // *MAIN*.xls or *MAIN*.xlsx
            }
        });

        let upload = multer({storage: storage}).single('excel');

        upload(req, res, function (err) {
            if (err) {
                console.log('Error uploading file');
                return res.end('Error uploading file.');
            }
            console.log('File ' + name + ' is uploaded');
            resolve(name);
        });
    });
};

