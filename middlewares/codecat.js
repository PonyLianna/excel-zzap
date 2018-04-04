const zipzap = require('./../config/zipzap');
const mysql = require('./database/database');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

// function getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
// }

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

function request(id, partnumber, class_man, excelTable, sellersTable) {
    return new Promise(async function (resolve, reject) {
        console.log(id + ' ' + class_man + ' ' + partnumber);
        await zipzap.GetSearchSuggestV2(id, partnumber, class_man, excelTable, sellersTable)
            .catch((err) => {
                console.log('Ohh fuck');
                return new Error(err);
            });
        return resolve();
    });

}

exports.codecat = function (excelTable, sellersTable) {
    return new Promise(async (resolve, reject) => {
        await mysql.getAllProductsLarge(excelTable).then(async function (products) {
            let time = (products.length * 3);
            console.log('Общее время выполнения: ' + time + ' секунд');

            asyncForEach(products, async function (product) {
                await waitFor(3200);
                request(product.id, product.Артикул, product.Производитель, excelTable, sellersTable)
                    .catch((err) => {
                        console.log('Error, but continue');
                        console.log(err);
                    });
            // })
                // .catch(async (err) => {
                // console.log('nextlvl');
                // console.log(err + ' but continue!');
                // await waitFor(4000);
                // test();
                // return;
                // // }).then(async function () {
                // //     await waitFor(3200);
                // //     console.log("end");
                // //     mysql.end();
                // //
                // //     return resolve();
            }).then(function () {
                resolve();
                console.log('test');
            });
        });

    });

};
