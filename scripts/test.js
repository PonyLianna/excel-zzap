// // require('../middlewares/sequelize/zipzap');
//
// const database = require('../middlewares/database');
// const old_database = require('../middlewares/database/database');
// const old_database_init = require('../middlewares/database/init');
// const excel = require('../middlewares/excelProcessing');
// const codecat = require('../middlewares/codecat');
// const dataProcessing = require('../middlewares/dataProcessing');
// const methods = require('../config/zipzap');
// async function start(){
//     await methods.GetSearchResultV2(663, "ZE-16331006", 'Auto Blik', 'el. CHEVROLET Lacetti (10-13) (L. Asf. Cr. 12V.)');
//     // await excel.csv('main.xls', 'main.csv');
//     // await mysql.db_csv('main.csv', 'excel');
//     // await codecat.newcodecat();
//     // await old_database.findPrices('SELECT vendor_code FROM excel WHERE code_cat IS NOT NULL AND avg_price IS NULL')
//     // await dataProcessing.newExport(0, 0)
// }
//
// start();
const email = require('../middlewares/postman');

async function start(){
    await email.sendMail('test', 'Excel ' + new Date(), '', __dirname + '/../final/final.xlsx');
}
start();

// async function start() {
//     await database.findPrices();
//     process.exit();
// }// addNewUser('test1', '123', '');
// start();
// deleteUser('test1');

// database.getUsers();

// console.log(posts);
// Users.find({}, function(err, posts){
//     console.log(posts)
// });

// Excel.findOne({where: {id: 1}}, function (err, post) {
//     console.log(post)
// });


// const models = require('../models')(schema);

// const database = require('../middlewares/database/database');
// const dataProcessing = require('../middlewares/dataProcessing');
// // database.insertTables();
// // database.findPrices('SELECT vendor_code FROM excel WHERE code_cat IS NOT NULL AND avg_price IS NULL');
// async function start(){
//     await dataProcessing.newExport();
// }
// start();

