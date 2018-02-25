const mysql = require('mysql');

let config = {
    host: 'localhost',
    user: 'root',
    password: ''
};

exports.config = config;

const excelColumn = "(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
    "Производитель VARCHAR(20), Артикул VARCHAR(100), Наименование VARCHAR(255), Цена INT(255), code_cat VARCHAR(20)," +
    "Минимальная_цена DECIMAL(10,2), Средняя_цена DECIMAL(10,2), Максимальная_цена DECIMAL(10,2))";
const usersColumn = "(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Имя VARCHAR(100) UNIQUE, Пароль VARCHAR(100), super TINYINT(1) ZEROFILL)";
const sellersColumn = "(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Продавец VARCHAR(255), Артикул VARCHAR(100), Цена DECIMAL(10,2))";
let database = "my_db";


function create_database() {
    const sql = "CREATE DATABASE " + database + "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    const connection = mysql.createConnection(config);
    connection.connect(function () {
        connection.query(sql, function () {
            config.database = database;
            console.log("Database created");
            connection.end();

            create_table("excel", excelColumn);
            create_table("users", usersColumn);
            create_table("sellers", sellersColumn);
        });
    });
}

function create_table(table, columns) {
    let sql = "CREATE TABLE " + table + columns;
    let alter = "ALTER TABLE " + table + " CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci";
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, function (err) {
            if (err) throw err;
            console.log("Table " + table + " created");
        });
        connection.query(alter, function (err) {
            if (err) throw err;
            console.log("Table " + table + " converted");
            connection.end();
        });
    });

}

exports.configure = function () {
    console.log("Starting!");
    create_database();
};

exports.destroy = function (my_table) {
    config.database = database;
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("DROP TABLE IF EXISTS " + my_table, function () {
            console.log("Table " + my_table + " dropped");
            connection.end();
        });
    });
};

exports.update = function (data) {
    const table = "excel";
    config.database = database;
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("INSERT INTO " + table + " (Производитель,Артикул,Наименование," +
            "Цена) VALUES ?", [data], function () {
            connection.end();
        });
    });

};

exports.db_csv = function () {
    config.database = database;
    config.flags = 'LOCAL_FILES';
    const sql = "LOAD DATA INFILE '" + (__dirname + "/..").replace(/\\/g, "/") + "/uploads/test2.csv' " +
        "INTO TABLE excel " +
        "CHARACTER SET UTF8 " +
        "FIELDS TERMINATED BY ',' " +
        "ENCLOSED BY '\"' " +
        "LINES TERMINATED BY '\\n' " +
        "IGNORE 1 ROWS (Производитель,Артикул,Наименование,Цена) ";
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
    const sql = "SELECT имя, пароль FROM users";
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
    const sql = "INSERT INTO users(Имя,Пароль,super) VALUES ?";
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
    const sql = "SELECT id, Производитель, Артикул FROM excel";
    const connection = mysql.createConnection(config);
    let promise = new Promise((resolve, reject) => {
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
    const table = "sellers";
    config.database = database;
    data = [data];
    const sql = "INSERT INTO " + table + "(Продавец,Артикул,Цена) VALUES ?";
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, [data], function (err) {
            if (err) throw err;
            console.log('Added new Seller ' + data);
            connection.end();
        });
    });
};

exports.addCodecat = function (data) {
    const table = "excel";
    config.database = database;
    const sql = "UPDATE " + table + " SET code_cat=" + data[1] + " WHERE id=" + data[0];
    console.log(sql);
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, function (err) {
            if (err) throw err;
            console.log('ID ' + data[0] + ' code_cat ' + data[1]);
            connection.end();
        });
    });
};

exports.findPrices = function () {

};