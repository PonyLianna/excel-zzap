const zipzap = require('./../config/zipzap');
const mysql = require('./../middlewares/database/database');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

test();

function test() {
    mysql.getAllProductsLarge().then(function (products) {
        let time = (products.length * 3);
        console.log('Общее время выполнения: ' + time + ' секунд');
        asyncForEach(products, async function (product) {
            await waitFor(3500);
            await request(product.id, product.Артикул, product.Производитель);
        });
    });
}

async function request(id, partnumber, class_man) {
    try {
        await zipzap.GetSearchSuggestV2(id, partnumber, class_man);
    } catch(error) {
        console.log(error + ' but continue!');
        return;
        test();
    }
    console.log(id + ' ' + class_man + ' ' + partnumber);
}
