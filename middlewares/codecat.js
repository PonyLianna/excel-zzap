const zipzap = require('./zipzap');
const mysql = require('./database/database');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

function request(id, partnumber, class_man, name) {
    return new Promise(async resolve => {
        logger.info(`${id} ${class_man} ${partnumber}`);
        console.log(`${id} ${class_man} ${partnumber}`);
        // let error_count = 0;

        await zipzap.GetSearchResultV2(id, partnumber, class_man, name).catch(async () => {
            logger.warn('Ошибка отправки запроса. Попробуем еще раз.');
            console.log('Ошибка отправки запроса. Попробуем еще раз.');
            await waitFor(4000);
            await request(id, partnumber, class_man, name);
        }).then(() => {
            resolve();
        });
    });
}

exports.codecat = function () {
    return new Promise(async resolve => {
        // mysql.getAllProducts().then(async function (products) {
        const products = await mysql.getAllProducts();

        const time = (products.length * 3.4);
        const startTime = new Date();
        logger.info(`Общее время выполнения: ${time} секунд`);
        await asyncForEach(products, async function (product, index, array) {
            await waitFor(3400);
            require('../app/socket').log(index, array, startTime);
            logger.debug(product.id, product.vendor_code, product.manufacturer, product.name);
            await request(product.id, product.vendor_code, product.manufacturer, product.name);

            logger.debug(`Переменная stop со значением ${stop}`);
            if (stop) throw new Error('Остановка процесса');
        }).catch(() => {
            logger.debug('Процесс остановлен');
        });

        await waitFor(4000);
        resolve();
        // });
    });
};

exports.request = request;