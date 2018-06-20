const mysql = require('mysql');
const config = require('../../config/db').config;

pool = mysql.createPool(config);
pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

pool.on('error', function (err) {
    console.log('Pool on error ', err);
});

exports.pool = pool;
exports.config = config;

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

let queryFunction = function (sql, info) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            connection.on('error', function (err) {
                console.log(err); // 'ER_BAD_DB_ERROR'
            });
            connection.query(sql, [info], async function (err, result, fields) {
                connection.release();
                if (err) {
                    console.log('SQL ', sql, ' Query Function ', err);
                    setTimeout(queryFunction(sql, info));
                }
                return resolve(result);
            });
            connection.on('error', function () {
                queryFunction(sql, info);
            })
        });
    });
};

exports.queryFunction = queryFunction;
exports.getUsers = async function () {
    const sql = 'SELECT name, password FROM users';
    // pool.query(sql, function (err, result, fields) {
    //     if (err) console.log('SQL ', sql, ' getUser Function ', err);
    //     console.log(result[0].name + ' ' + result[0].password);
    // });
    return await queryFunction(sql)
};

exports.getAllProducts = async function (table) {
    return await queryFunction('SELECT id, manufacturer, vendor_code FROM ' + table);
};

exports.getAllProductsLarge = async function (table) {
    const last = await exports.findLast(table);
    const sql = 'SELECT id, manufacturer, vendor_code FROM ' + table + ' WHERE id >=' + last;

    return await queryFunction(sql);
};

exports.addNewSeller = function (data, sellersTable) {
    data = [data];
    const sql = 'INSERT INTO ' + sellersTable + '(seller,vendor_code,price,instock,wholesale) VALUES ?';
<<<<<<< HEAD
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
=======
    return new Promise(async (resolve, reject) => {
        // pool.query(sql, [data], async function (err) {
        //     if (err) console.log('SQL ', sql, ' addNewSeller Function ', err);
        //     await console.log('Added new Seller ' + data);
        //     resolve();
        // });
        await queryFunction(sql, [data]);
        resolve()
>>>>>>> c36cb054d270536326047748d6ae69b72784e258
    });
};

exports.addCodecat = async function (data, excelTable) {
    return new Promise(async (resolve, reject) => {
        const sql = 'UPDATE ' + excelTable + ' SET code_cat=' + data[1] + ' WHERE id = ' + data[0];
        console.log(sql);
<<<<<<< HEAD
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, async function (err) {
                if (err) throw err;
                await console.log('ID ' + data[0] + ' code_cat ' + data[1]);
                connection.release();
                resolve();
            });
        });
=======
        // pool.query(sql, async function (err) {
        //     if (err) console.log('SQL ', sql, ' Query Function ', err);
        //     await console.log('ID ' + data[0] + ' code_cat ' + data[1]);
        //     resolve();
        // });
        await queryFunction(sql);
        resolve();
>>>>>>> c36cb054d270536326047748d6ae69b72784e258
    });
};

exports.findPrices = function (excel_sql) {
    return new Promise(function (resolve, reject) {
        pool.query(excel_sql, function (err, result) {
            if (err) console.log('SQL ', sql, ' Query Function ', err);
            result.forEach(async function (row) {
                const partnumber = row.vendor_code;
                const sql = 'UPDATE excel SET ' +
                    'min_price = (SELECT MIN(price) FROM sellers WHERE vendor_code = "' + partnumber + '"), ' +
                    'avg_price = (SELECT AVG(price) FROM sellers WHERE vendor_code = "' + partnumber + '"), ' +
                    'max_price = (SELECT MAX(price) FROM sellers WHERE vendor_code = "' + partnumber + '") ' +
                    'WHERE vendor_code = "' + partnumber + '"';

                // pool.query(sql, function (err, result) {
                //     if (err) console.log('SQL ', sql, ' Query Function ', err);
                //     console.log(sql);
                // });
                await queryFunction(sql);
            });
        });
        resolve();
    });
};

exports.addEmpty = function (data) {
    const table = 'empty';
    const sql = 'INSERT INTO ' + table + '(id, vendor_code) VALUES (?)';
<<<<<<< HEAD
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, [data], async function (err) {
                if (err) throw err;
                console.log('Added Empty code ' + data);
                resolve();
            });
        });
=======
    return new Promise(async (resolve, reject) => {
        // pool.query(sql, [data], async function (err) {
        //     if (err) console.log('SQL ', sql, ' Query Function ', err);
        //     console.log('Added Empty code ' + data);
        //     resolve();
        // });
        await queryFunction(sql, [data]);
        resolve();
>>>>>>> c36cb054d270536326047748d6ae69b72784e258
    });
};

exports.findLast = function (table) {
    const sql = "SELECT MAX(id) FROM " + table + " WHERE code_cat IS NOT NULL";
    return new Promise(async (resolve, reject) => {
        const results = await queryFunction(sql);
        const result = results[0][Object.keys(results[0])];
        if (!result){
            resolve(1);
        }else{
            resolve(result);
        }
        // pool.query(sql, function (err, results, fields) {
        //     if (err) console.log('SQL ', sql, ' Query Function ', err);
        //     const result = results[0][Object.keys(results[0])];
        //     console.log("Finded " + result);
        //     if (!result) {
        //         resolve(1);
        //     } else {
        //         resolve(result);
        //     }
        // });
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
        console.log('Empty');
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
