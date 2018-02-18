const mysql = require('mysql');

let config = {
    host: 'localhost',
    user: 'root',
    password: ''
};

exports.config = config;

let excelColumn = "(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
    "Производитель VARCHAR(20), Артикул VARCHAR(100), Наименование VARCHAR(255), Цена INT(255), Количество INT(255)," +
    "Срок_поставки INT(255), Минимальная_цена DECIMAL(10,2), Средняя_цена DECIMAL(10,2), Максимальная_цена DECIMAL(10,2))";
let usersColumn = "(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Имя VARCHAR(100) UNIQUE, Пароль VARCHAR(100), super TINYINT(1) ZEROFILL)";

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
        console.log();
        connection.query("INSERT INTO " + table + " (Производитель,Артикул,Наименование," +
            "Цена,Количество,Срок_поставки) VALUES ?", [data], function () {
            connection.end();
        });
    });

};

exports.db_csv = function () {
    config.database = database;
    config.flags = 'LOCAL_FILES';
    const sql = "LOAD DATA INFILE '" + (__dirname + "/..").replace(/\\/g, "/") + "/uploads/test1.csv' " +
        "INTO TABLE excel " +
        "CHARACTER SET UTF8 " +
        "FIELDS TERMINATED BY ',' " +
        "ENCLOSED BY '\"' " +
        "LINES TERMINATED BY '\\n' " +
        "IGNORE 1 ROWS (Производитель,Артикул,Наименование,Цена,Количество,Срок_поставки) ";
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) throw err;
        console.log(sql);
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