const zipzap = require('./../config/zipzap');
const mysql = require('./../middlewares/database');
const my_async = require('async');

test();

function test() {
    mysql.getAllProductsLarge().then(function (products) {
        let time = (products.length * 3);
        console.log('Общее время выполнения: ' + time + ' секунд');
        my_async.eachSeries(products, function (product, callback) {
            try {
                setTimeout(async function () {
                    await request(product.id, product.Артикул, product.Производитель);
                    callback();
                }, 3500);
            } catch (err) {
                console.log('Error! But continue!');
                test();
            }
        });
    });
}

function request(id, partnumber, class_man) {
    let promise = new Promise((resolve, reject) => {
        zipzap.GetSearchSuggestV2(id, partnumber, class_man);
        console.log(id + ' ' + class_man + ' ' + partnumber);
        resolve();
    });
    return promise;

}

