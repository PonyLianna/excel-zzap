const mysql = require('mysql');
// var mysql = require('mysql');

let config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "testing2"
};

let connection = mysql.createConnection(config);

connection.connect(function () {
    console.log("Connected!");
});

// let config = require('../../config/db').config;
// const database = require('../../config/db').db;

const excelColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    'manufacturer VARCHAR(20), ' +
    'vendor_code VARCHAR(100), ' +
    'name VARCHAR(255), ' +
    'code_cat VARCHAR(20), ' +
    'min_price DECIMAL(10,2), ' +
    'avg_price DECIMAL(10,2), ' +
    'max_price DECIMAL(10,2))';

const usersColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    'name VARCHAR(100) UNIQUE, ' +
    'password VARCHAR(100), ' +
    'super TINYINT(1) ZEROFILL)';

const sellersColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    'seller VARCHAR(255), ' +
    'vendor_code VARCHAR(100), ' +
    'price DECIMAL(10,2), ' +
    'instock TINYINT(1), ' +
    'wholesale TINYINT(1))';

const emptyCodecat = '(id INT NOT NULL, ' +
    'vendor_code VARCHAR(100))';

const temp = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    'manufacturer VARCHAR(20), ' +
    'vendor_code VARCHAR(100), ' +
    'name VARCHAR(255))';

const times = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    'time VARCHAR(50))';

const sessions = '(sid varchar(255) COLLATE utf8_unicode_ci NOT NULL,' +
    '  session text COLLATE utf8_unicode_ci NOT NULL,' +
    '  expires int(11) DEFAULT NULL,' +
    '  PRIMARY KEY (sid))';

exports.test = function(){
    return new Promise(resolve =>
    {
        connection.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            resolve();
        });
    })
};

let queryFunction = function (sql, info) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.query(sql, [info], function (err, result, fields) {
            connection.end();
            if (err) console.log(config);
            resolve(result);
        });
    });
};

exports.configure = async function () {
    console.log('Starting configuration!');
    return createAll();
};

async function createAll() {
    const sql = "CREATE DATABASE " + database + " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    console.log(sql);
    await setConnections();

    await create_db(sql).catch(function (err) {
        console.log(123);
    });

    return Promise.all([
        config.database = database,
        create_table('excel', excelColumn),
        create_table('pre_excel', excelColumn),
        create_table('temp_excel', excelColumn),
        create_table('users', usersColumn),
        create_table('sellers', sellersColumn),
        create_table('pre_sellers', sellersColumn),
        create_table('temp', temp),
        create_table('empty', emptyCodecat),
        create_table('pre_empty', emptyCodecat),
        create_table('times', times),
        create_table('sessions', sessions)
    ]);
}

function create_db(sql) {
    return new Promise(async (resolve, reject) => {
        await queryFunction(sql);
        console.log(sql);
        resolve();
    });
}

function setConnections() {
    return new Promise(async (resolve, reject) => {
        await queryFunction('set global max_connections = 1000');
        console.log('Max connection SET 1000');
        resolve()
    });
}

function create_table(table, columns) {
    let sql = 'CREATE TABLE ' + table + columns;
    let alter = 'ALTER TABLE ' + table + ' CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci';
    return new Promise(async (resolve, reject) => {
        await queryFunction(sql);
        console.log('Table ' + table + ' created');
        await queryFunction(alter);
        console.log('Table ' + table + ' converted');
        resolve();
    });
}

exports.destroy = function (my_table) {
    return new Promise(async (resolve, reject) => {
        config.database = database;
        await queryFunction('DROP TABLE IF EXISTS ??', my_table);
        console.log('Table ' + my_table + ' dropped');
        resolve();
    });
};

exports.truncate = function (my_table) {
    return new Promise(async (resolve, reject) => {
        config.database = database;
        await queryFunction('truncate table ??', my_table);
        resolve();
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
            "IGNORE 1 ROWS (manufacturer,vendor_code,name)";

        await queryFunction(sql);
        resolve();
    });
};

exports.createUser = function (name, password, admin = '0') {
    const sql = 'INSERT INTO users(name,password,super) VALUES (?)';
    return new Promise(async (resolve, reject) => {
        await queryFunction(sql, [name, password, admin]);
        console.log('User: ' + name + ' ' + password + ' added!');
        console.log('Successful added');
        resolve();
    });
};

exports.deleteUser = function (name) {
    const sql = 'DELETE FROM users WHERE name = ?';
    return new Promise(async (resolve, reject) => {
        await queryFunction(sql, [name]);
        console.log('User: ' + name + ' deleted!');
        console.log('Successful deleted');
        resolve();
    });
};

exports.fixSession = async function () {
    return exports.truncate('sessions');
};