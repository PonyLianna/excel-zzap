const mysql = require('./../middlewares/database/database');
const xlsx = require('xlsx');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function save (name, filename, info) {
    console.log('MySQL is here');
    const wb = await xlsx.utils.book_new();
    console.log('Book created');
    const ws = await xlsx.utils.json_to_sheet(info);
    console.log('To sheet ended');
    await xlsx.utils.book_append_sheet(wb, ws, name);
    console.log('Saved');
    xlsx.writeFileSync(wb, filename);
    console.log('Everything is here!');
}

const name = "sheetjs";
const filename = "./final/finalwithsellers1.xlsx";

async function test(){
    let data = await read();
    save(name, filename, data);
}

async function read() {
    return new Promise(async function (resolve, reject) {
        let arr = [];
        let zero = await mysql.selectAll();
        let myzero = zero;
        let processed = 0;

        asyncForEach(zero, async function(value, i){
            waitFor(10);
            let seller = await mysql.selectSeller(value.Артикул);
            await seller.forEach(function (value) {
                let sell = value.Продавец;
                let num = value.Цена;
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
        // zero.forEach(await async function (value, i) {
        //     let seller = await mysql.selectSeller(value.Артикул);
        //     await seller.forEach(function (value) {
        //         let sell = value.Продавец;
        //         let num = value.Цена;
        //         myzero[i][sell] = num;
        //     });
        //     processed++;
        //     if (processed === zero.length){
        //         resolve(myzero);
        //     }
        // });
    });
}

test();
