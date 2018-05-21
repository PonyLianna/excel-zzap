const zipzap = require('./../config/zipzap');
const mysql = require('./database/database');
const fs = require('fs');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

let errCounter = 0;
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

function request(id, partnumber, class_man, excelTable, sellersTable) {
    return new Promise(async function (resolve, reject) {
        console.log(id + ' ' + class_man + ' ' + partnumber);
        await zipzap.GetSearchResultV2(id, partnumber, class_man, excelTable, sellersTable)
            .catch((err) => {
                console.log(errCounter);
                errCounter += 1;
                fs.appendFile('log.txt', err + "\n" + errCounter + "\n", function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
                return new Error(err);
            });
        return resolve();
    });
}

exports.codecat = function (excelTable, sellersTable, io) {
    return new Promise(async (resolve, reject) => {
        mysql.getAllProducts(excelTable).then(async function (products) {
            let time = (products.length * 3.4);
            console.log('Общее время выполнения: ' + time + ' секунд');
            await asyncForEach(products, async function (product, index, array) {
                await waitFor(3400);
                require('../app/socket').log(index, array);
                await request(product.id, product.vendor_code, product.manufacturer, excelTable, sellersTable);
            });
            await waitFor(4000);
            resolve();
        });
    });
};

exports.codecatFilter = function (excelTable, sellersTable, io) {
    return new Promise(async (resolve, reject) => {
        mysql.getAllProductsLarge(excelTable).then(async function (products) {
            let time = (products.length * 3.4);
            console.log('Общее время выполнения: ' + time + ' секунд');
            await asyncForEach(products, async function (product, index, array) {
                await waitFor(3400);
                require('../app/socket').log(index, array);
                await request(product.id, product.vendor_code, product.manufacturer, excelTable, sellersTable);
            });
            await waitFor(4000);
            resolve();
        });
    });
};

exports.codecatTest = function (excelTable, sellersTable, products) {
    return new Promise(async (resolve, reject) => {
        let time = (products.length * 3.4);
        console.log('Общее время выполнения: ' + time + ' секунд');
        await asyncForEach(products, async function (product, index, array) {
            await waitFor(3400);
            require('../app/socket').log(index, array);
            await request(product.id, product.vendor_code, product.manufacturer, excelTable, sellersTable);
        });
        await waitFor(4000);
        resolve();
    });
};