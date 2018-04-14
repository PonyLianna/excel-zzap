const mysql = require('mysql');
let config = require('../../config/db').config;

const excelColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,' +
    'Производитель VARCHAR(20), Артикул VARCHAR(100), Наименование VARCHAR(255), code_cat VARCHAR(20),' +
    'Минимальная_цена DECIMAL(10,2), Средняя_цена DECIMAL(10,2), Максимальная_цена DECIMAL(10,2))';
const usersColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Имя VARCHAR(100) UNIQUE, Пароль VARCHAR(100), super TINYINT(1) ZEROFILL)';
const sellersColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Продавец VARCHAR(255), Артикул VARCHAR(100), Цена DECIMAL(10,2),' +
    ' instock TINYINT(1), wholesale TINYINT(1))';
const emptyCodecat = '(id INT NOT NULL, Артикул VARCHAR(100))';
const temp = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Производитель VARCHAR(20), Артикул VARCHAR(100), Наименование VARCHAR(255))';
const times = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, time VARCHAR(20))';
let database = 'my_db';

exports.configure = function () {
    console.log('Starting!');
    create_database();
};

function create_database() {
    const sql = 'CREATE DATABASE ' + database + ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
    const connection = mysql.createConnection(config);
    connection.connect(function () {
        connection.query(sql, function () {
            config.database = database;
            console.log('Database created');
            connection.end();
            setConnections();
            create_table('excel', excelColumn);
            create_table('pre_excel', excelColumn);
            create_table('temp_excel', excelColumn);

            create_table('users', usersColumn);
            create_table('sellers', sellersColumn);
            create_table('pre_sellers', sellersColumn);
            create_table('temp', temp);

            create_table('empty', emptyCodecat);
            create_table('pre_empty', emptyCodecat);

            create_table('times', times);
        });
    });
}

function setConnections() {
    const connection = mysql.createConnection(config);
    connection.query('set global max_connections = 1000', function () {
        console.log('Max connection SET 1000');
        connection.end();
    });
}

function create_table(table, columns) {
    let sql = 'CREATE TABLE ' + table + columns;
    let alter = 'ALTER TABLE ' + table + ' CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci';
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
        });
    });
}

exports.destroy = function (my_table) {
    config.database = database;
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query('DROP TABLE IF EXISTS ' + my_table, function () {
            console.log('Table ' + my_table + ' dropped');
            connection.end();
        });
    });
};

exports.db_csv = function (filename, tablename) {
    return new Promise (async (resolve, reject) => {
        console.log('db_csv');
        config.flags = 'LOCAL_FILES';
        const sql = "LOAD DATA INFILE '" + (__dirname + "/../..").replace(/\\/g, "/") + "/uploads/" + filename + "' " +
            "INTO TABLE "+ tablename +
            " CHARACTER SET UTF8 " +
            "FIELDS TERMINATED BY ',' " +
            "ENCLOSED BY '\"' " +
            "LINES TERMINATED BY '\\n' " +
            "IGNORE 1 ROWS (Производитель,Артикул,Наименование) ";
        const connection = await mysql.createConnection(config);
        await connection.connect(async function (err) {
            if (err) throw err;
            await connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                resolve();
                connection.end();
            });
        });
    });
};

exports.createUser = function (name, password, admin = '0') {
    let value = [[name, password, admin]];
    const sql = 'INSERT INTO users(Имя,Пароль,super) VALUES ?';
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, [value], function (err) {
            if (err) throw err;
            console.log('User: ' + name + ' ' + password + ' added!');
            connection.end();
        });
    });
};