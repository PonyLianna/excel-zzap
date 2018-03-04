const mysql = require('mysql');

let config = {
    host: 'localhost',
    user: 'root',
    password: ''
};

const excelColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,' +
    'Производитель VARCHAR(20), Артикул VARCHAR(100), Наименование VARCHAR(255), code_cat VARCHAR(20),' +
    'Минимальная_цена DECIMAL(10,2), Средняя_цена DECIMAL(10,2), Максимальная_цена DECIMAL(10,2))';
const usersColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Имя VARCHAR(100) UNIQUE, Пароль VARCHAR(100), super TINYINT(1) ZEROFILL)';
const sellersColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Продавец VARCHAR(255), Артикул VARCHAR(100), Цена DECIMAL(10,2))';
const emptyCodecat = '(id INT NOT NULL, Артикул VARCHAR(100))';
const temp = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Производитель VARCHAR(20), Артикул VARCHAR(100), Наименование VARCHAR(255))';
let database = 'my_db';

pool_config = config;
pool_config.connectionLimit = 400;
pool_config.database = database;
let pool = mysql.createPool(config);

exports.config = config;

function create_database() {
    const sql = 'CREATE DATABASE ' + database + 'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
    const connection = mysql.createConnection(config);
    connection.connect(function () {
        connection.query(sql, function () {
            config.database = database;
            console.log('Database created');
            connection.end();
            setConnections();
            create_table('excel', excelColumn);
            create_table('users', usersColumn);
            create_table('sellers', sellersColumn);
            create_table('empty', emptyCodecat);
            create_table('temp', temp);
        });
    });
}

function setConnections() {
    const connection = mysql.createConnection(config);
    connection.query('set global max_connections = 300', function () {
        console.log('Max connection SET 300');
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

exports.configure = function () {
    console.log('Starting!');
    create_database();
};

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

exports.update = function (data) {
    const table = 'excel';
    config.database = database;
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query('INSERT INTO ' + table + ' (Производитель,Артикул,Наименование,' +
            'Цена) VALUES ?', [data], function () {
            connection.end();
        });
    });

};

exports.db_csv = function () {
    config.database = database;
    config.flags = 'LOCAL_FILES';
    const sql = "LOAD DATA INFILE '" + (__dirname + "/..").replace(/\\/g, "/") + "/uploads/test.csv' " +
        "INTO TABLE excel " +
        "CHARACTER SET UTF8 " +
        "FIELDS TERMINATED BY ',' " +
        "ENCLOSED BY '\"' " +
        "LINES TERMINATED BY '\\n' " +
        "IGNORE 1 ROWS (Производитель,Артикул,Наименование) ";
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, function (err) {
            if (err) throw err;
            connection.end();
        });
    });

};
exports.getUsers = function () {
    config.database = database;
    const sql = 'SELECT имя, пароль FROM users';
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result[0].Имя + ' ' + result[0].Пароль);
            connection.end();
        });
    });
};

exports.createUser = function (name, password, admin = '0') {
    config.database = database;
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

exports.getAllProducts = function () {
    config.database = database;
    const sql = 'SELECT id, Производитель, Артикул FROM excel';
    let promise = new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) throw err;
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.end();
                resolve(result);
            });
        });
    });
    return promise;
};

exports.getAllProductsLarge = async function () {
    config.database = database;
    const last = await exports.findLast();
    const sql = 'SELECT id, Производитель, Артикул FROM excel WHERE id >=' + last;
    let promise = new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) throw err;
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.end();
                resolve(result);
            });
        });
    });
    return promise;
};

exports.addNewSeller = function (data) {
    const table = 'sellers';
    config.database = database;
    data = [data];
    const sql = 'INSERT INTO ' + table + '(Продавец,Артикул,Цена) VALUES ?';
    let promise = new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) throw err;
            connection.query(sql, [data], function (err) {
                if (err) throw err;
                console.log('Added new Seller ' + data);
                resolve();
                connection.end();
            });
        });
    });
    return promise;
};

exports.addCodecat = function (data) {
    const table = 'excel';
    config.database = database;
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

exports.endPool = function () {
    pool.end();
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
    config.database = database;
    const sql = 'INSERT INTO ' + table + '(id, Артикул) VALUES (?)';
    let promise = new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) throw err;
            connection.query(sql, [data], function (err) {
                if (err) throw err;
                console.log('Added Empty code ' + data);
                connection.end();
                resolve();
            });
        });
    });
    return promise;
};

exports.findLast = function () {
    const sql = "SELECT GREATEST((SELECT MAX(id) FROM empty),(SELECT MAX(id) FROM excel WHERE code_cat IS NOT NULL))";
    let promise = new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(function (err) {
            if (err) throw err;
            connection.query(sql, function (err, results, fields) {
                if (err) throw err;
                const result = results[0][Object.keys(results[0])];
                console.log("Finded " + result);
                connection.end();
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
