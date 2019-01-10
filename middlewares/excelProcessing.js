const xlsx = require('xlsx');
const fs = require('fs');

exports.csv = function (filename, outname) {
    return new Promise(async (resolve, reject)=>{
        logger.debug('Процессинг csv');
        let excel = await xlsx.readFile(`./uploads/${filename}`);
        logger.debug('Чтение csv закончено');
        let sheet_name_list = excel.SheetNames;
        let stream = await xlsx.stream.to_csv(excel.Sheets[sheet_name_list[0]]);
        await stream.pipe(fs.createWriteStream('./uploads/' + outname));
        resolve();
    });
};