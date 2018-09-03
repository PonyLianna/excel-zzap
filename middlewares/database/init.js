const mysql = require('mysql');
const configuration = require('../../config/config');

let config = configuration.dbconfig;
config.database = configuration.dbname;

let connection;

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

function handleDisconnect() {
    connection = mysql.createConnection(config);

    connection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function (err) {
        // console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else if (err.code === 'ETIMEDOUT') {
            connection.connect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

const excelColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    'manufacturer VARCHAR(20), ' +
    'vendor_code VARCHAR(100), ' +
    'name VARCHAR(100), ' +
    'code_cat VARCHAR(20), ' +
    'min_price DECIMAL(8,2), ' +
    'avg_price DECIMAL(8,2), ' +
    'max_price DECIMAL(8,2), ' +
    'UNIQUE KEY manufacturer (manufacturer,name,vendor_code))';

const usersColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    'name VARCHAR(100) UNIQUE, ' +
    'password VARCHAR(100))';

const sellersColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    'seller VARCHAR(255), ' +
    'vendor_code VARCHAR(100), ' +
    'price DECIMAL(10,2), ' +
    'instock TINYINT(1), ' +
    'wholesale TINYINT(1))';

const emptyCodecat = '(id INT NOT NULL, ' +
    'vendor_code VARCHAR(100))';

const times = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    'time VARCHAR(50))';

const sessions = '(sid varchar(255) COLLATE utf8_unicode_ci NOT NULL,' +
    '  session text COLLATE utf8_unicode_ci NOT NULL,' +
    '  expires int(11) DEFAULT NULL,' +
    '  PRIMARY KEY (sid))';

let queryFunction = function (sql, info) {
    return new Promise(async resolve => {
        connection.query(sql, [info], function (err, result, fields) {
            if (err) console.log(err);
            return resolve(result);
        });
    });
};

exports.configure = async function () {
    console.log('Starting configuration!');
    await createAll();
};

async function createAll() {
    await Promise.all([
        setConnections(),
        create_table('excel', excelColumn),
        create_table('pre_excel', excelColumn),

        create_table('users', usersColumn),
        create_table('sellers', sellersColumn),
        create_table('pre_sellers', sellersColumn),

        create_table('empty', emptyCodecat),
        create_table('pre_empty', emptyCodecat),
        create_table('times', times),
        create_table('sessions', sessions)
    ]);
    connection.end();
}

function setConnections() {
    return new Promise(async resolve => {
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

function destroy(my_table) {
    return new Promise(async (resolve, reject) => {
        // config.database = database;
        await queryFunction('DROP TABLE IF EXISTS ??', my_table);
        console.log('Table ' + my_table + ' dropped');
        resolve();
    });
}

exports.destroyEverything = async function(...tables){
    await asyncForEach(tables, async (table)=>{
        await destroy(table);
    });
    // await Promise.all(tables.map((table)=>{destroy(table)}));
    console.log('Everything is done');
    connection.end();
};

exports.truncate = function (my_table) {
    return new Promise(async (resolve, reject) => {
        await queryFunction('truncate table ??', my_table);
        resolve();
    });
};

exports.db_csv = function (filename, tablename) {
    return new Promise(async resolve => {
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

exports.createUser = function (name, password) {
    const sql = 'INSERT INTO users(name,password) VALUES (?)';
    return new Promise(async resolve => {
        await queryFunction(sql, [name, password]);
        console.log('User: ' + name + ' ' + password + ' added!');
        console.log('Successful added');
        connection.end();
        resolve();
    });
};

exports.deleteUser = function (name) {
    const sql = 'DELETE FROM users WHERE name = ?';
    return new Promise(async resolve => {
        await queryFunction(sql, [name]);
        console.log('User: ' + name + ' deleted!');
        console.log('Successful deleted');
        connection.end();
        resolve();
    });
};

exports.fixSession = async function () {
    return exports.truncate('sessions');
};