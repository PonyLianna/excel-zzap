const mysql = require('mysql');
const config = require('../../config/db').config;

pool = mysql.createPool(config);
exports.pool = pool;

exports.config = config;

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

let queryFunction = function (sql, info) {
    return new Promise((resolve, reject) => {
        pool.query(sql, [info], async function (err, result, fields) {
            if (err) throw err;
            return resolve(result);
        });
    });
};

exports.getUsers = function () {
    const sql = 'SELECT name, password FROM users';
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result[0].name + ' ' + result[0].password);
            connection.release();
        });
    });
};

exports.getAllProducts = async function (table) {
    return await queryFunction('SELECT id, manufacturer, vendor_code FROM ' + table);
};

exports.getAllProductsLarge = async function (table) {
    const last = await exports.findLast(table);
    const sql = 'SELECT id, manufacturer, vendor_code FROM ' + table + ' WHERE id >=' + last;
    //const sql = 'SELECT id, manufacturer, vendor_code FROM ' + table;

    // return new Promise((resolve, reject) => {
    //     pool.query(sql, function (err, rows, fields) {
    //         if (err) throw err;
    //         resolve(rows);
    //     });
    // });
    return await queryFunction(sql);
};

exports.addNewSeller = function (data, sellersTable) {
    data = [data];
    const sql = 'INSERT INTO ' + sellersTable + '(seller,vendor_code,price,instock,wholesale) VALUES ?';
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, [data], async function (err) {
                if (err) throw err;
                await console.log('Added new Seller ' + data);
                connection.release();
                resolve();
            });
        });
    });
};

exports.addCodecat = async function (data, excelTable) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE ' + excelTable + ' SET code_cat=' + data[1] + ' WHERE id = ' + data[0];
        console.log(sql);
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, async function (err) {
                if (err) throw err;
                await console.log('ID ' + data[0] + ' code_cat ' + data[1]);
                connection.release();
                resolve();
            });
        });
    });
};

exports.findPrices = function (excel_sql) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(async function (err, connection) {
            if (err) throw err;
            await connection.query(excel_sql, function (err, result) {
                if (err) throw err;
                result.forEach(function (row) {
                    const partnumber = row.vendor_code;
                    const sql = 'UPDATE excel SET ' +
                        'min_price = (SELECT MIN(price) FROM sellers WHERE vendor_code = "' + partnumber + '"), ' +
                        'avg_price = (SELECT AVG(price) FROM sellers WHERE vendor_code = "' + partnumber + '"), ' +
                        'max_price = (SELECT MAX(price) FROM sellers WHERE vendor_code = "' + partnumber + '") ' +
                        'WHERE vendor_code = "' + partnumber + '"';

                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log(sql);
                    });
                });
            });
            resolve();
        });
    });
};

exports.addEmpty = function (data) {
    const table = 'empty';
    const sql = 'INSERT INTO ' + table + '(id, vendor_code) VALUES (?)';
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, [data], async function (err) {
                if (err) throw err;
                console.log('Added Empty code ' + data);
                resolve();
            });
        });
    });
};

exports.findLast = function (table) {
    const sql = "SELECT MAX(id) FROM " + table + " WHERE code_cat IS NOT NULL";
    return new Promise((resolve, reject) => {
        pool.query(sql, function (err, results, fields) {
            if (err) throw err;
            const result = results[0][Object.keys(results[0])];
            console.log("Finded " + result);
            if (!result) {
                resolve(1);
            } else {
                resolve(result);
            }
        });
    });
};

exports.selectAll = async function () {
    await waitFor(2000);
    return await queryFunction('SELECT * FROM excel');
};

exports.selectSeller = async function (codename) { // vendor_code
    return await queryFunction('SELECT seller, price FROM pre_sellers WHERE vendor_code = ?', codename);
};

exports.selectSellerFilter = async function (codename, instock, wholesale) { // vendor_code
    return await queryFunction('SELECT seller, price FROM sellers ' +
        'WHERE vendor_code = "' + codename +
        '" AND instock = ' + instock +
        ' AND wholesale = ' + wholesale); // Problems with quotes
};

exports.selectSellers = async function () {
    return await queryFunction('SELECT DISTINCT(seller) FROM sellers');
};

exports.insertTables = function () {
    return new Promise(async (resolve, reject) => {
        await queryFunction('INSERT INTO excel(manufacturer, vendor_code, name, code_cat, ' +
            'min_price, avg_price, max_price) SELECT manufacturer, vendor_code, ' +
            'name, code_cat, min_price, avg_price, max_price FROM pre_excel');
        await queryFunction('INSERT INTO sellers(seller, vendor_code, price, instock, wholesale) SELECT seller, ' +
            'vendor_code, price, instock, wholesale FROM pre_sellers');
        console.log('INSERTED to real');
        resolve();
    });
};

exports.cleanTables = async function () {
    return new Promise(async (resolve, reject) => {
        await queryFunction('TRUNCATE TABLE pre_excel');
        await queryFunction('TRUNCATE TABLE pre_sellers');
        await queryFunction('TRUNCATE TABLE empty');
        await console.log('Empty');
        resolve();
    });
};

exports.cleanTablesSocket = async function () {
    return new Promise(async (resolve, reject) => {
        await queryFunction('TRUNCATE TABLE sellers');
        await queryFunction('TRUNCATE TABLE empty');
        resolve();
    });
};

exports.getAllProductsFilter = async function () {
    return await queryFunction('SELECT * FROM excel'); // WHERE codecat IS NOT NULL
};

exports.fixSession = async function () {
    return new Promise(async (resolve, reject) => {
        await queryFunction('truncate table sessions');
        resolve();
        pool.end();
    });
};
