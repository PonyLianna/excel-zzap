const mysql = require('mysql');

let config = {
    host: 'localhost',
    user: 'root',
    password: ''
};


let excelColumn = "(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
    "Производитель VARCHAR(20), Артикул VARCHAR(100), Наименование VARCHAR(255), Цена INT(255), Количество INT(255)," +
    "Срок_поставки INT(255), Минимальная_цена DECIMAL(10,2), Средняя_цена DECIMAL(10,2), Максимальная_цена DECIMAL(10,2))";
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

exports.destroy = function (my_table) {
    config.database = database;
    const connection = mysql.createConnection(config);
    connection.connect(function () {
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
        })
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
            connection.end()
        })
    });

}