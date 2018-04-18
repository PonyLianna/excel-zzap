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
        // let zero = await mysql.selectAll();
        let myzero = zero;
        let processed = 0;

        asyncForEach(zero, async function(value, i){
            waitFor(10);
            let seller = await mysql.selectSeller(value.Артикул);
            await seller.forEach(function (value) {
                let sell = value.seller;
                let num = value.price;
                myzero[i][sell] = num;
            });
            processed++;
            console.log(processed);
            console.log(zero.length);
            if (processed === zero.length){
                console.log('finished');
                resolve(myzero);
            }
        });
    });
}

async function altRead(zero, instock, wholesale) {
    return new Promise(async function (resolve, reject) {
        let arr = [];
        // let zero = await mysql.selectAll();
        let myzero = zero;
        let processed = 0;
        console.log('test');
        console.log(zero);

        await asyncForEach(zero, async function(value, i){
            console.log('Im in async!');
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
            console.log(processed);
            console.log(zero.length);
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
    console.log('altexport');
    let data = await altRead(exportFrom, instock, wholesale);
    return await save(name, filename, data);
};
