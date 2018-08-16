const mysql = require('mysql');
const configuration = require('../../config/config');

let config = configuration.dbconfig;
config.database = configuration.dbname;

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

function handleDisconnect() {
    connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

let queryFunction = function (sql, info) {
    return new Promise(async resolve => {
        connection.query(sql, [info], function (err, result, fields) {
            if (err) console.log(err);
            return resolve(result);
        });
    });
};

exports.queryFunction = queryFunction;
exports.getUsers = async function () {
    const sql = 'SELECT name, password FROM users';
    return await queryFunction(sql)
};

exports.getAllProducts = async function () {
    return await queryFunction('SELECT id, manufacturer, vendor_code, name FROM pre_excel');
};

exports.getAllProductsLarge = async function (table) {
    const last = await exports.findLast(table);
    const sql = 'SELECT id, manufacturer, vendor_code FROM ' + table + ' WHERE id >=' + last;

    return await queryFunction(sql);
};

exports.addNewSeller = function (class_user, partnumber, price, instock, wholesale) {
    const sql = 'INSERT INTO pre_sellers(seller,vendor_code,price,instock,wholesale) VALUES (?)';
    return new Promise(async resolve => {
        await queryFunction(sql, [class_user, partnumber, price, instock, wholesale]);
        resolve()
    });
};

exports.addCodecat = async function (data) {
    return new Promise(async resolve => {
        const sql = 'UPDATE pre_excel SET code_cat=' + data[1] + ' WHERE id = ' + data[0];
        console.log(sql);
        await queryFunction(sql);
        resolve();
    });
};

exports.findPrices = function () {
    return new Promise(async resolve => {
        let result = await queryFunction('SELECT vendor_code FROM excel');
        await asyncForEach(result, async function (row) {
        // await Promise.all(result.map(async (row) => {
            const partnumber = row.vendor_code;

            const sql = 'UPDATE excel SET ' +
                `min_price = (SELECT MIN(price) FROM sellers WHERE vendor_code = \"${partnumber}\"), ` +
                `avg_price = (SELECT AVG(price) FROM sellers WHERE vendor_code = \"${partnumber}\"), ` +
                `max_price = (SELECT MAX(price) FROM sellers WHERE vendor_code = \"${partnumber}\") ` +
                `WHERE vendor_code = "${partnumber}"`;

            console.log(partnumber);
            await queryFunction(sql);
            // });
        });
        resolve();
    });
};

exports.addEmpty = function (id, partnumber) {
    const table = 'empty';
    const sql = 'INSERT INTO ' + table + '(id, vendor_code) VALUES (?)';
    return new Promise(async (resolve, reject) => {
        await queryFunction(sql, [id, partnumber]);
        resolve();
    });
};

exports.findLast = function (table) {
    const sql = "SELECT MAX(id) FROM " + table + " WHERE code_cat IS NOT NULL";
    return new Promise(async (resolve, reject) => {
        const results = await queryFunction(sql);
        const result = results[0][Object.keys(results[0])];
        if (!result) {
            resolve(1);
        } else {
            resolve(result);
        }
    });
};

exports.selectAll = async function () {
    return await queryFunction('SELECT * FROM excel');
};

exports.selectSeller = async function (codename) { // vendor_code
    return await queryFunction('SELECT seller, price FROM sellers WHERE vendor_code = ?', [codename]);
};

exports.selectSellerFilter = async function (codename, instock, wholesale) { // vendor_code
    return await queryFunction('SELECT seller, price FROM sellers ' +
        'WHERE vendor_code = \"' + codename +
        '\" AND instock = ' + instock +
        ' AND wholesale = ' + wholesale);
};

exports.selectSellers = async function () {
    return await queryFunction('SELECT DISTINCT(seller) FROM sellers');
};

exports.insertTables = function () {
    return new Promise(async (resolve, reject) => {
        await queryFunction('INSERT INTO excel(manufacturer, vendor_code, name, code_cat, ' +
            'min_price, avg_price, max_price) SELECT manufacturer, vendor_code, ' +
            'name, code_cat, min_price, avg_price, max_price FROM pre_excel ' +
            'ON DUPLICATE KEY UPDATE manufacturer=pre_excel.manufacturer,' +
            'vendor_code=pre_excel.vendor_code, name=pre_excel.name,' +
            'code_cat=pre_excel.code_cat, min_price=pre_excel.min_price,' +
            'avg_price=pre_excel.avg_price, max_price=pre_excel.max_price');

        await queryFunction('INSERT INTO sellers(seller, vendor_code, price, instock, wholesale) SELECT seller, ' +
            'vendor_code, price, instock, wholesale FROM pre_sellers ON DUPLICATE KEY UPDATE ' +
            'seller=pre_sellers.seller, vendor_code=pre_sellers.vendor_code, price=pre_sellers.price,' +
            'instock=pre_sellers.instock, wholesale=pre_sellers.wholesale');

        console.log('INSERTED to real');
        resolve();
    });
};

exports.cleanTables = async function () {
    return new Promise(async (resolve, reject) => {
        await queryFunction('TRUNCATE TABLE pre_excel');
        await queryFunction('TRUNCATE TABLE pre_sellers');
        await queryFunction('TRUNCATE TABLE empty');
        console.log('Empty');
        resolve();
    });
};

exports.cleanTablesSocket = async function () {
    return new Promise(async (resolve, reject) => {
        await queryFunction('TRUNCATE TABLE sellers');
        await queryFunction('TRUNCATE TABLE excel');
        await queryFunction('TRUNCATE TABLE empty');
        resolve();
    });
};

exports.getAllProductsFilter = async function () {
    return await queryFunction('SELECT * FROM excel'); // WHERE codecat IS NOT NULL
};
