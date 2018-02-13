const mysql = require('mysql');

let config = {
    host: 'localhost',
    user: 'root',
    password: ''
};
let excelColumn = "(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
    "Производитель VARCHAR(20), Артикул SMALLINT UNSIGNED, Наименование VARCHAR(100), Цена SMALLINT UNSIGNED, Количество SMALLINT UNSIGNED," +
    "Срок_поставки SMALLINT UNSIGNED, Минимальная_цена DECIMAL(10,2), Средняя_цена DECIMAL(10,2), Максимальная_цена DECIMAL(10,2))";
let usersColumn = "(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Имя VARCHAR(100), Пароль VARCHAR(32))";

let database = "my_db";

function create_database() {
    const connection = mysql.createConnection(config);
    connection.connect(function () {
        connection.query("CREATE DATABASE " + database, function () {
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
    const connection = mysql.createConnection(config);
    connection.connect(function () {
        connection.query(sql, function () {
            console.log("Table " + table + " created");
            connection.end();
        });
    });
}

exports.configure = function () {
    console.log("Starting!");
    create_database();
};

exports.destroy = function (mytable) {
    config.database = database;
    const connection = mysql.createConnection(config);
    connection.connect(function () {
        connection.query("DROP TABLE IF EXISTS " + mytable, function () {
            console.log("Table " + mytable + " dropped");
            connection.end();
        });
    });
}