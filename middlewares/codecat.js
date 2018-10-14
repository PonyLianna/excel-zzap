const zipzap = require('./zipzap');
const mysql = require('./database/database');
const fs = require('fs');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

let errCounter = 0;
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

function request(id, partnumber, class_man, name) {
    return new Promise(async resolve => {
        logger.info(id + ' ' + class_man + ' ' + partnumber);
        zipzap.GetSearchResultV2(id, partnumber, class_man, name).catch(async (err) => {
            logger.warn('Ошибка отправки запроса. Попробуем еще раз.');
            await waitFor(2000);
            await request(id, partnumber, class_man, name);
        }).then(() => {
            return resolve();
        });
    });
}

exports.codecat = function () {
    return new Promise(async (resolve, reject) => {
        mysql.getAllProducts().then(async function (products) {
            let time = (products.length * 3.4);
            const startTime = new Date();
            logger.info('Общее время выполнения: ' + time + ' секунд');
            await asyncForEach(products, async function (product, index, array) {
                await waitFor(3400);
                require('../app/socket').log(index, array, startTime);
                logger.debug(product.id, product.vendor_code, product.manufacturer, product.name);
                await request(product.id, product.vendor_code, product.manufacturer, product.name);
            });
            await waitFor(4000);
            resolve();
        });
    });
};
