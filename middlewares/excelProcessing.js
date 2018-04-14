const xlsx = require('xlsx');
const mysql = require('./database/database');
const fs = require('fs');

exports.csv = function (filename, outname) {
    return new Promise(async (resolve, reject)=>{
        console.log('csv');
        let excel = await xlsx.readFile('./uploads/' + filename);
        console.log('Reading is successful');
        let sheet_name_list = excel.SheetNames;
        let stream = await xlsx.stream.to_csv(excel.Sheets[sheet_name_list[0]]);
        await stream.pipe(fs.createWriteStream('./uploads/' + outname));
        resolve();
    });
};