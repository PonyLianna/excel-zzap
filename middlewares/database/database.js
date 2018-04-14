const mysql = require('mysql');
const config = require('../../config/db').config;

let pool = mysql.createPool(config);
exports.config = config;

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

let queryFunction = function (sql) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                resolve(result);
            });
        });
    });
};

exports.getUsers = function () {
    const sql = 'SELECT имя, пароль FROM users';
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result[0].Имя + ' ' + result[0].Пароль);
            connection.release();
        });
    });
};

exports.getAllProducts = function (table) {
    const sql = 'SELECT id, Производитель, Артикул FROM ' + table;
    let promise = new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                resolve(result);
            });
        });
    });
    return promise;
};

exports.getAllProductsLarge = async function (table) {
    const last = await exports.findLast(table);
    const sql = 'SELECT id, Производитель, Артикул FROM ' + table + ' WHERE id >=' + last;
    //const sql = 'SELECT id, Производитель, Артикул FROM ' + table;

    return new Promise((resolve, reject) => {
        pool.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
};

exports.addNewSeller = function (data, sellersTable) {
    data = [data];
    const sql = 'INSERT INTO ' + sellersTable + '(Продавец,Артикул,Цена,instock,wholesale) VALUES ?';
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, [data], async function (err) {
                if (err) throw err;
                await console.log('Added new Seller ' + data);
                await connection.release();
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
                await connection.release();
                resolve();
            });
        });
    });
};

exports.findPrices = function () {
    const excel_sql = 'SELECT Артикул FROM excel WHERE code_cat IS NOT NULL AND Средняя_Цена IS NULL';
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(excel_sql, function (err, result) {
            if (err) throw err;
            result.forEach(function (result) {
                const partnumber = result.Артикул;
                const sql = 'UPDATE excel SET ' +
                    'Минимальная_цена = (SELECT MIN(Цена) FROM sellers WHERE Артикул = "' + partnumber + '"), ' +
                    'Средняя_цена = (SELECT AVG(Цена) FROM sellers WHERE Артикул = "' + partnumber + '"), ' +
                    'Максимальная_цена = (SELECT MAX(Цена) FROM sellers WHERE Артикул = "' + partnumber + '") ' +
                    'WHERE Артикул = "' + partnumber + '"';

                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(sql);
                });
            });
        });
    });
};

exports.addEmpty = function (data) {
    const table = 'empty';
    const sql = 'INSERT INTO ' + table + '(id, Артикул) VALUES (?)';
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, [data], async function (err) {
                if (err) throw err;
                console.log('Added Empty code ' + data);
                await connection.release();
                resolve();
            });
        });
    });
};

exports.findLast = function (table) {
    // const sql = "SELECT GREATEST((SELECT MAX(id) FROM empty),(SELECT MAX(id) FROM excel WHERE code_cat IS NOT NULL))";
    const sql = "SELECT MAX(id) FROM " + table + " WHERE code_cat IS NOT NULL";
    let promise = new Promise((resolve, reject) => {
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
    return promise;
};

exports.selectAll = function () {
    const excel_sql = 'SELECT * FROM excel';
    let promise = new Promise(async function (resolve, reject) {
        await waitFor(2000);
        pool.query(excel_sql, function (err, result) {
            if (err) throw err;
            resolve(result);
        })
    });
    return promise;
};

exports.selectSeller = async function (codename) { // Артикул
    const excel_sql = 'SELECT Продавец, Цена FROM sellers WHERE Артикул = ?';
    let promise = new Promise(async (resolve, reject) => {
        await waitFor(10);
        pool.query(excel_sql, [codename], function (err, result) {
            if (err) throw err;
            resolve(result);
        })
    });
    return promise;
};

exports.selectSellers = function () {
    const excel_sql = 'SELECT DISTINCT(Продавец) FROM sellers';
    let promise = new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(excel_sql, function (err, result) {
                if (err) throw err;
                resolve(result);
            })
        })
    });
    return promise;
};

exports.returnSellers = function () {
    const excel_sql = "call users();";
    console.log(excel_sql);
    let promise = new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(excel_sql, function (err, result) {
                if (err) throw err;
                resolve(result);
            })
        })
    });
    return promise;
};

exports.insertTable = function () {
    return new Promise(async (resolve, reject) => {
        await queryFunction('INSERT INTO excel(Производитель, Артикул, Наименование, code_cat, ' +
            'Минимальная_цена, Средняя_цена, Максимальная_цена) SELECT Производитель, Артикул, ' +
            'Наименование, code_cat, Минимальная_цена, Средняя_цена, Максимальная_цена FROM pre_excel');
        await queryFunction('INSERT INTO sellers(Продавец, Артикул, Цена) SELECT Продавец, ' +
            'Артикул, Цена FROM pre_sellers');
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

