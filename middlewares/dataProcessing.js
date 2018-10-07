const mysql = require('./database/database');
const xlsx = require('xlsx');

const name = "sheetjs";
const filename = `${require('../config/config').finalExcel.path}\\${require('../config/config').finalExcel.name}.xlsx`;

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

function save(name, filename, info) {
    return new Promise(async (resolve, reject) => {
        console.log('MySQL is here');
        const wb = await xlsx.utils.book_new();
        console.log('Book created');
        const ws = await xlsx.utils.json_to_sheet(info);
        console.log('To sheet ended');
        await xlsx.utils.book_append_sheet(wb, ws, name);
        console.log('Saved');
        xlsx.writeFileSync(wb, filename);
        console.log('Everything is here!');
        resolve();
    });
}

async function read(zero) {
    return new Promise(async function (resolve, reject) {
        let arr = [];
        let myzero = zero;
        let processed = 0;
        await asyncForEach(zero, async function (value, i) {
            console.log(value);
            let seller = await mysql.selectSeller(value.vendor_code);
            await seller.forEach(function (value) {
                let sell = value.seller;
                let num = value.price;
                myzero[i][sell] = num;
            });
            processed++;
            if (processed === zero.length) {
                console.log('finished');
                resolve(myzero);
            }
        });
    });
}

async function alternativeRead(exportFrom, instock, wholesale){
    return new Promise(async function(resolve){
        console.log(1);
        let processed = 0;
        await Promise.all(exportFrom.map(async (item) => {
            console.log(processed);
            let seller = await mysql.selectSellerFilter(item.vendor_code, instock, wholesale);
            if (seller.length){
                seller.forEach(function (value) {
                    console.log(value);
                    exportFrom[processed][value.seller] = value.price;
                });
            }
            processed++;
            if (processed === exportFrom.length){
                console.log('Finished');
                console.log(exportFrom);
                resolve(exportFrom);
            }
        }))
    })
}

exports.export = async function (exportFrom) {
    let data = await read(exportFrom);
    return await save(name, filename, data);
};

exports.altExport = async function (exportFrom, instock, wholesale) {
    let data = await alternativeRead(exportFrom, instock, wholesale);
    return await save(name, filename, data);
};