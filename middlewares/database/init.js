const mysql = require('mysql');

let config = require('../../config/db').config;
const database = require('../../config/db').db;

const excelColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,' +
    'manufacturer VARCHAR(20), vendor_code VARCHAR(100), name VARCHAR(255), code_cat VARCHAR(20),' +
    'min_price DECIMAL(10,2), avg_price DECIMAL(10,2), max_price DECIMAL(10,2))';
const usersColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) UNIQUE, password VARCHAR(100), super TINYINT(1) ZEROFILL)';
const sellersColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, seller VARCHAR(255), vendor_code VARCHAR(100), price DECIMAL(10,2),' +
    ' instock TINYINT(1), wholesale TINYINT(1))';
const emptyCodecat = '(id INT NOT NULL, vendor_code VARCHAR(100))';
const temp = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, manufacturer VARCHAR(20), vendor_code VARCHAR(100), name VARCHAR(255))';
const times = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, time VARCHAR(50))';

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

exports.configure = async function () {
    console.log('Starting!');
    return createAll();
};

async function createAll() {
    const sql = 'CREATE DATABASE ' + database + ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
    console.log(sql);

    config.database = database;

    await setConnections();

    return Promise.all([
        create_db(sql).catch(function (err) {
            console.log(err)
        }),
        create_table('excel', excelColumn),
        create_table('pre_excel', excelColumn),
        create_table('temp_excel', excelColumn),

        create_table('users', usersColumn),

        create_table('sellers', sellersColumn),
        create_table('pre_sellers', sellersColumn),
        create_table('temp', temp),

        create_table('empty', emptyCodecat),
        create_table('pre_empty', emptyCodecat),

        create_table('times', times)
    ]);
}

function create_db(sql) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) reject(err);
            connection.query(sql, function (err) {
                if (err) reject(err);
                console.log('Database ' + database + " created");
                resolve();
                connection.end(); // 2 days wp
            });
        });
    });
}

function setConnections() {
    return new Promise(function (resolve, reject) {
        const connection = mysql.createConnection(config);
        connection.query('set global max_connections = 1000', function () {
            console.log('Max connection SET 1000');
            connection.end();
            resolve();
        });
    });

}

//
function create_table(table, columns) {
// exports.create_table = function (table, columns) {
    let sql = 'CREATE TABLE ' + table + columns;
    let alter = 'ALTER TABLE ' + table + ' CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci';
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) throw err;
            connection.query(sql, function (err) {
                if (err) throw err;
                console.log('Table ' + table + ' created');
            });
            connection.query(alter, function (err) {
                if (err) throw err;
                console.log('Table ' + table + ' converted');
                connection.end();
                resolve();
            });
        });
    });
}

exports.destroy = function (my_table) {
    return new Promise((resolve, reject) => {
        config.database = database;
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) throw err;
            connection.query('DROP TABLE IF EXISTS ' + my_table, function () {
                console.log('Table ' + my_table + ' dropped');
                connection.end();
                resolve();
            });
        });
    });
};

exports.db_csv = function (filename, tablename) {
    return new Promise(async (resolve, reject) => {
        console.log('db_csv');
        config.flags = 'LOCAL_FILES';
        const sql = "LOAD DATA LOCAL INFILE '" + (__dirname + "/../..").replace(/\\/g, "/") +
            "/uploads/" + filename + "' " +
            "INTO TABLE " + tablename +
            " CHARACTER SET UTF8 " +
            "FIELDS TERMINATED BY ',' " +
            "ENCLOSED BY '\"' " +
            "LINES TERMINATED BY '\\n' " +
            "IGNORE 1 ROWS (manufacturer,vendor_code,name) ";
        const connection = await mysql.createConnection(config);
        await connection.connect(async function (err) {
            if (err) throw err;
            await connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                connection.end();
                resolve();
            });
        });
    });
};

exports.createUser = function (name, password, admin = '0') {
    let value = [[name, password, admin]];
    const sql = 'INSERT INTO users(name,password,super) VALUES ?';
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) throw err;
            connection.query(sql, [value], function (err) {
                if (err) throw err;
                //console.log('User: ' + name + ' ' + password + ' added!');
                console.log('Successful added');
                connection.end();
                resolve();
            });
        });
    });
};

exports.deleteUser = function (name) {
    let value = [[name]];
    const sql = 'DELETE FROM users WHERE name = ?';
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) throw err;
            connection.query(sql, [value], function (err) {
                if (err) throw err;
                //console.log('User: ' + name + ' ' + password + ' added!');
                console.log('Successful deleted');
                connection.end();
                resolve();
            });
        });
    });
};

exports.deleteSessions = function (name) {
    let value = [[name]];
    const sql = 'DELETE FROM users WHERE name = ?';
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) throw err;
            connection.query(sql, [value], function (err) {
                if (err) throw err;
                //console.log('User: ' + name + ' ' + password + ' added!');
                console.log('Successful deleted');
                connection.end();
                resolve();
            });
        });
    });
};