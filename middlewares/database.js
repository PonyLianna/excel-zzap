const caminte = require('caminte'),
    Schema = caminte.Schema,
    config = {
        driver: "mysql",
        host: "localhost",
        port: "3306",
        username: "root",
        password: "",
        database: "test_db",
        autoReconnect: true
    };
//
const schema = new Schema(config.driver, config);
const ext = require('../middlewares/database_ext');

const Excel = require('../models/Excel')(schema);
const PreExcel = require('../models/PreExcel')(schema);
const Sellers = require('../models/Sellers')(schema);
const PreSellers = require('../models/PreSellers')(schema);
const Users = require('../models/Users')(schema);
// const Temp = require('../models/Temp')(schema);
const Times = require('../models/Times')(schema);
// const Empty = require('../models/Empty')(schema);

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

function getUsers() {
    return new Promise(resolve => {
        Users.all({}, function (err, user) {
            console.log(user);
            resolve(user)
        })
    })
}

function getSellers(vendor_code) {
    return new Promise(resolve => {
        Sellers.find({where: {vendor_code: vendor_code}}, function (err, results) {
            resolve(results);
        })
    })
}

function addNewUser(username, password, admin) {
    Users.create({name: username, password: password, super: admin}, function (err, result) {
        if (err) throw err
    });
    console.log(`Username: ${username}, Password: ${password}`)
}

function deleteUser(username) {
    Users.remove({where: {name: username}}, function (err, results) {
        if (err) throw err
    });
    console.log(`Username: ${username} removed from database!`);
}

async function getExcel() {
    return new Promise(resolve => {
        Excel.all({}, function (err, results) {
            console.log(results);
            resolve(results); // return id, manufacturer, vendor_code, name from table EXCEL
        })
    })

}

function addNewSeller(seller, vendor_code, price, instock, wholesale) {
    Excel.create({
            seller: seller,
            vendor_code: vendor_code,
            price: price,
            instock: instock,
            wholesale: wholesale
        },
        function (err, results) {
            if (err) throw err
        }
    )
}

function addCodecat(id, code_cat) {
    Excel.update({where: {id: id}}, {codecat: code_cat}, function (err, results) {
        if (err) throw err
    })
}

function selectSellers(vendor_code, instock, wholesale){
    Sellers.find({where: {vendor_code: vendor_code, instock: instock, wholesale: wholesale}, function(err, results){
        if (err) throw err;
    }})
}

function findPrices() {
    return new Promise(async (resolve, reject) => {
        Excel.find({where: {code_cat: {gte: ''}, avg_price: null}}, async function (err, results) {
            await asyncForEach(results, async function (result) {
                let massive = await Sellers.find({where: {vendor_code: result.vendor_code}},
                    async function (err, results, callback) {
                        callback(await ext.toMassive(results));
                    });
                Excel.update({vendor_code: result.vendor_code}, {
                    min_price: ext.minimum(massive),
                    avg_price: ext.average(massive),
                    max_price: ext.maximum(massive)
                }, function (err, results) {
                })
            });
            resolve();
        });
    });
}

function cleanTables() {
    Excel.remove({}, function (err, results) {
    });
    Sellers.remove({}, function (err, results) {
    });
    Empty.remove({}, function (err, results) {
    });
}
//
// function cleanMainTables() {
//     Excel.remove({}, function (err, results) {
//     });
//     Sellers.remove({}, function (err, results) {
//     });
// }

async function insertTables() { // слишком медленный
    // return Promise.all(
    return new Promise(async resolve => {
        //     PreExcel.all({}, async function (err, results) {
        //         // console.log(results);
        //         await Promise.all(results.map(async (item) => {
        //             await waitFor(200);
        //             console.log(item);
        //             await Excel.updateOrCreate({
        //                     manufacturer: item.manufacturer,
        //                     vendor_code: item.vendor_code, name: item.name
        //                 },
        //                 {
        //                     code_cat: item.code_cat
        //                 })
        //         }));
        //     });
        await PreSellers.all({}, async function (err, results) {
            await Promise.all(results.map(async (item) => {
                console.log(item);
                Sellers.updateOrCreate({
                        seller: item.seller,
                        vendor_code: item.vendor_code
                    },
                    {
                        price: item.price,
                        instock: item.instock,
                        wholesale: item.wholesale
                    })
            }));
            resolve();
        });

        // )
    })
}

function test() {
    console.log(1)
}

module.exports = {
    getUsers: getUsers,
    getExcel: getExcel,
    getSellers: getSellers,

    addNewUser: addNewUser,
    addCodecat: addCodecat,
    // addEmpty: addEmpty,
    addNewSeller: addNewSeller,

    selectSellers: selectSellers,
    deleteUser: deleteUser,
    findPrices: findPrices,
    // cleanMainTables: cleanMainTables,
    cleanTables: cleanTables,
    insertTables: insertTables,
    test: test

};