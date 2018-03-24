const mysql = require('mysql');
const config = require('../../config/db').config;

let pool = mysql.createPool(config);
exports.config = config;

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));



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

exports.getAllProducts = function () {
    const sql = 'SELECT id, Производитель, Артикул FROM excel';
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

exports.getAllProductsLarge = async function () {
    const last = await exports.findLast();
    const sql = 'SELECT id, Производитель, Артикул FROM excel WHERE id >=' + last;
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

exports.addNewSeller = function (data) {
    const table = 'sellers';
    data = [data];
    const sql = 'INSERT INTO ' + table + '(Продавец,Артикул,Цена) VALUES ?';
    let promise = new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, [data], function (err) {
                if (err) throw err;
                console.log('Added new Seller ' + data);
                connection.release();
                resolve();
            });
        });
    });
    return promise;
};

exports.addCodecat = function (data) {
    const table = 'excel';
    const sql = 'UPDATE ' + table + ' SET code_cat=' + data[1] + ' WHERE id=' + data[0];
    console.log(sql);
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, function (err) {
            if (err) throw err;
            connection.release();
            console.log('ID ' + data[0] + ' code_cat ' + data[1]);
        });
    })
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
    let promise = new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, [data], function (err) {
                if (err) throw err;
                console.log('Added Empty code ' + data);
                connection.release();
                resolve();
            });
        });
    });
    return promise;
};

exports.findLast = function () {
    const sql = "SELECT GREATEST((SELECT MAX(id) FROM empty),(SELECT MAX(id) FROM excel WHERE code_cat IS NOT NULL))";
    let promise = new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, function (err, results, fields) {
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
        await waitFor(2000);
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


