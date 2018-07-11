const mysql = require('mysql');
// const config = require('../../config/db').config;


let config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "testing2"
};

// pool = mysql.createPool(config);
// pool.on('acquire', function (connection) {
//     console.log('Connection %d acquired', connection.threadId);
// });
//
// pool.on('release', function (connection) {
//     console.log('Connection %d released', connection.threadId);
// });
//
// exports.pool = pool;
// exports.config = config;
let connection = mysql.createConnection(config);

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

handleDisconnect(connection);

function handleDisconnect(client) {
    client.on('error', function (error) {
        if (!error.fatal) return;
        if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw err;

        console.error('> Re-connecting lost MySQL connection: ' + error.stack);

        // NOTE: This assignment is to a variable from an outer scope; this is extremely important
        // If this said `client =` it wouldn't do what you want. The assignment here is implicitly changed
        // to `global.mysqlClient =` in node.
        connection = mysql.createConnection(client.config);
        handleDisconnect(connection);
        connection.connect();
    });
}

// connection.connect(function(err, callback) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
// });
//
// connection.end(function(err) {
//     if(err) {
//         console.log(err.message);
//     }
// });

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
        // pool.query(sql, info, async (err, results, fields) => {
        //     // connection.release();
        //     if (err) console.log('SQL ', sql, ' Query Function ', err);
        //     //     setTimeout(queryFunction(sql, info));
        //     // }
        // return resolve(results);
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
    return new Promise(async (resolve, reject) => {
        // pool.query(sql, [data], async function (err) {
        //     if (err) console.log('SQL ', sql, ' addNewSeller Function ', err);
        //     await console.log('Added new Seller ' + data);
        //     resolve();
        // });
        await queryFunction(sql, [class_user, partnumber, price, instock, wholesale]);
        resolve()
    });
};

exports.addCodecat = async function (data) {
    return new Promise(async (resolve, reject) => {
        const sql = 'UPDATE pre_excel SET code_cat=' + data[1] + ' WHERE id = ' + data[0];
        console.log(sql);
        // pool.query(sql, async function (err) {
        //     if (err) console.log('SQL ', sql, ' Query Function ', err);
        //     await console.log('ID ' + data[0] + ' code_cat ' + data[1]);
        //     resolve();
        // });
        await queryFunction(sql);
        resolve();
    });
};

exports.findPrices = function (excel_sql) {
    return new Promise(async function (resolve, reject) {
        // pool.query(excel_sql, async function (err, result) {
        //     if (err) console.log('SQL ', sql, ' Query Function ', err);
        let result = await queryFunction(excel_sql);
        await asyncForEach(result, async function (row) {
            // await waitFor(500);
            const partnumber = row.vendor_code;
            const sql = 'UPDATE excel SET ' +
                'min_price = (SELECT MIN(price) FROM sellers WHERE vendor_code = ?), ' +
                'avg_price = (SELECT AVG(price) FROM sellers WHERE vendor_code = ?), ' +
                'max_price = (SELECT MAX(price) FROM sellers WHERE vendor_code = ?) ' +
                'WHERE vendor_code = ?';

            // pool.query(sql, function (err, result) {
            //     if (err) console.log('SQL ', sql, ' Query Function ', err);
            //     console.log(sql);
            // });
            console.log(partnumber);
            await queryFunction(sql, [partnumber, partnumber, partnumber, partnumber]);
        });
        resolve();
    });
};

exports.addEmpty = function (id, partnumber) {
    const table = 'empty';
    const sql = 'INSERT INTO ' + table + '(id, vendor_code) VALUES (?)';
    return new Promise(async (resolve, reject) => {
        // pool.query(sql, [data], async function (err) {
        //     if (err) console.log('SQL ', sql, ' Query Function ', err);
        //     console.log('Added Empty code ' + data);
        //     resolve();
        // });
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
    console.log(123);
    return await queryFunction('SELECT * FROM excel');
};

exports.selectSeller = async function (codename) { // vendor_code
    return await queryFunction('SELECT seller, price FROM sellers WHERE vendor_code = ?', [codename]);
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
