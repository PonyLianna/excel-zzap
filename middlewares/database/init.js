const mysql = require('mysql');
const configuration = require('../../config/config');
const logger = require('../logger').main();

let config = configuration.dbconfig;
config.database = configuration.dbname;

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(config);

    connection.connect(function (err) {
        if (err) {
            logger.warn('Ошибка соединения с базой данных', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function (err) {
        logger.warn('Ошибка базы данных', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else if (err.code === 'ETIMEDOUT') {
            connection.connect();
        } else {
            logger.error('Критическая ошибка!', err);
        }
    });
}

handleDisconnect();

const excelColumn = '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    'manufacturer VARCHAR(40), ' +
    'vendor_code VARCHAR(100), ' +
    'name VARCHAR(200))';

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
            if (err) logger.debug(err);
            return resolve(result);
        });
    });
};

exports.configure = async function () {
    logger.info('Начинаем конфигурацию');
    await createAll();
};

async function createAll() {
    await Promise.all([
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

function create_table(table, columns) {
    let sql = `CREATE TABLE ${table} ${columns}`;
    let alter = `ALTER TABLE ${table} CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci`;
    return new Promise(async resolve => {
        await queryFunction(sql);
        logger.info(`Таблица ${table} создана`);
        await queryFunction(alter);
        logger.info(`Таблица ${table} переконвертированна`);
        resolve();
    });
}

function destroy(table) {
    return new Promise(async resolve => {
        await queryFunction('DROP TABLE IF EXISTS ??', table);
        logger.info(`Таблица ${table} уничтожена`);
        resolve();
    });
}

exports.destroyEverything = async function (...tables) {
    for (table of tables){
        await destroy(table);
    }
    logger.info('База данных уничтожена');
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
        logger.silly('Вносим в базу данных csv');
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
        logger.info(`Пользователь: ${name} ${password} добавлен!`);
        connection.end();
        resolve();
    });
};

exports.deleteUser = function (name) {
    const sql = 'DELETE FROM users WHERE name = ?';
    return new Promise(async resolve => {
        await queryFunction(sql, [name]);
        logger.info(`Пользователь: ${name} ${password} удален!`);
        connection.end();
        resolve();
    });
};

exports.fixSession = async function () {
    return exports.truncate('sessions');
};

exports.destroy = destroy;