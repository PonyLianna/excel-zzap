const mysql = require('./database/database');
const xlsx = require('xlsx');

const name = "sheetjs";
const filename = "./final/final.xlsx";

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

function save (name, filename, info) {
    return new Promise(async (resolve, reject) =>{
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
        console.log(1234);
        await asyncForEach(zero, async function(value, i){
            console.log(value);
            let seller = await mysql.selectSeller(value.vendor_code);
            await seller.forEach(function (value) {
                let sell = value.seller;
                let num = value.price;
                myzero[i][sell] = num;
            });
            processed++;
            if (processed === zero.length){
                console.log('finished');
                resolve(myzero);
            }
        });
    });
}

async function alternativeRead(instock, wholesale){
    return new Promise(async function(){
        let arr = await database.getExcel();
        let processed = 0;
        await Promise.all(arr.map(async (item) => {
            let seller = database.selectSellers(item.vendor_code, instock, wholesale);
            if (seller){
                seller.forEach(function (value) {
                    arr[processed][value.seller] = value.price;
                });
            }
            processed++;
            if (processed === arr.length){
                console.log('Finished');
                resolve(arr);
            }
        }))
    })
}

async function altRead(zero, instock, wholesale) {
    return new Promise(async function (resolve, reject) {
        let arr = [];
        let myzero = zero;
        let processed = 0;
        console.log(1123);
        console.log(zero);

        await asyncForEach(zero, async function(value, i){
            waitFor(10);
            let seller = await mysql.selectSellerFilter(value.vendor_code, instock, wholesale);
            if (seller) {
                console.log(1);
                await seller.forEach(function (value) {
                    let sell = value.seller;
                    let num = value.price;
                    myzero[i][sell] = num;
                });
            }
            processed++;
            if (processed === zero.length){
                console.log('Finished');
                resolve(myzero);
            }
        });
    });
}

exports.export = async function(exportFrom){
    let data = await read(exportFrom);
    return await save(name, filename, data);
};

exports.altExport = async function(exportFrom, instock, wholesale){
    let data = await altRead(exportFrom, instock, wholesale);
    return await save(name, filename, data);
};

exports.newExport = async function(instock, wholesale){
    let data = await alternativeRead(instock, wholesale);
    return await save(name, filename, data);
};