const xlsx = require('xlsx');
const mysql = require('./database/database');
const fs = require('fs');

// exports.read = function () {
//     // console.log(time);
//     excel = xlsx.readFile('./uploads/test2.xlsx');
//     console.log('Reading is successful');
//     let sheet_name_list = excel.SheetNames;
//     my_array = Array();
//     sheet = xlsx.utils.sheet_to_json(excel.Sheets[sheet_name_list[0]]);
//     setTimeout(function () {
//         readSheet();
//         console.log(my_array);
//         mysql.update(my_array);
//     });
//
//     function readSheet(err) {
//         for (let i in sheet) {
//             if (err) throw err;
//             let product = sheet[i];
//             my_array.push([
//                 product['Производитель'],
//                 product['Артикул'],
//                 product['Наименование'],
//                 product['Цена'],
//                 product['Количество'],
//                 product['Срок поставки']
//             ]);
//         }
//     }
// };

exports.csv = function (filename, outname) {
    return new Promise(async (resolve, reject)=>{
        let excel = xlsx.readFile('./uploads/' + filename);
        console.log('Reading is successful');
        let sheet_name_list = excel.SheetNames;
        let stream = await xlsx.stream.to_csv(excel.Sheets[sheet_name_list[0]]);
        await stream.pipe(fs.createWriteStream('./uploads/' + outname));
        resolve();
    });
};