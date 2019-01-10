const mysql = require('mysql');
const configuration = require('../../config/config');

let config = configuration.dbconfig;
config.database = configuration.dbname;

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

let queryFunction = function (sql, info) {
    return new Promise(async resolve => {
        connection.query(sql, [info], function (err, result, fields) {
            if (err) logger.error(err);
            return resolve(result);
        });
    });
};

exports.queryFunction = queryFunction;
exports.getUsers = async function () {
    const sql = 'SELECT name, password FROM users';
    return await queryFunction(sql)
};

exports.getAllProducts = async function () {
    return await queryFunction('SELECT id, manufacturer, vendor_code, name FROM pre_excel');
};

exports.addNewSeller = function (class_user, partnumber, price, instock, wholesale) {
    const sql = 'INSERT INTO pre_sellers(seller,vendor_code,price,instock,wholesale) VALUES (?)';
    return new Promise(async resolve => {
        await queryFunction(sql, [class_user, partnumber, price, instock, wholesale]);
        resolve()
    });
};

exports.addEmpty = function (id, partnumber) {
    const sql = 'INSERT INTO  empty (id, vendor_code) VALUES (?)';
    return new Promise(async (resolve, reject) => {
        await queryFunction(sql, [id, partnumber]);
        resolve();
    });
};

exports.addCodecat = async function (code_cat, id) {
    return new Promise(async resolve => {
        const sql = `UPDATE pre_excel SET code_cat= ${code_cat} WHERE id = ${id}`;
        console.log(sql);
        await queryFunction(sql);
        resolve();
    });
};

exports.findLast = function (table) {
    const sql = `SELECT MAX(id) FROM ${table} WHERE code_cat IS NOT NULL`;
    return new Promise(async (resolve, reject) => {
        const results = await queryFunction(sql);
        const result = results[0][Object.keys(results[0])];
        if (!result) {
            resolve(1);
        } else {
            resolve(result);
        }
    });
};

exports.selectAll = async function () {
    return await queryFunction('SELECT * FROM excel');
};

exports.selectSeller = async function (codename) { // vendor_code
    return await queryFunction('SELECT seller, price FROM sellers WHERE vendor_code = ?', [codename]);
};

exports.selectSellerFilter = async function (codename, instock, wholesale) { // vendor_code
    return await queryFunction('SELECT seller, price FROM sellers ' +
        'WHERE vendor_code = \"' + codename +
        '\" AND instock = ' + instock +
        ' AND wholesale = ' + wholesale);
};

exports.selectSellers = async function () {
    return await queryFunction('SELECT DISTINCT(seller) FROM sellers');
};

exports.insertTables = function () {
    return new Promise(async resolve => {
        await queryFunction('INSERT INTO excel(manufacturer, vendor_code, name) ' +
            'SELECT manufacturer, vendor_code, name FROM pre_excel ' +
            'ON DUPLICATE KEY UPDATE manufacturer=pre_excel.manufacturer,' +
            'vendor_code=pre_excel.vendor_code, name=pre_excel.name');

        await queryFunction('INSERT INTO sellers(seller, vendor_code, price, instock, wholesale) SELECT seller, ' +
            'vendor_code, price, instock, wholesale FROM pre_sellers ON DUPLICATE KEY UPDATE ' +
            'seller=pre_sellers.seller, vendor_code=pre_sellers.vendor_code, price=pre_sellers.price,' +
            'instock=pre_sellers.instock, wholesale=pre_sellers.wholesale');

        logger.debug('Импортировали в настоящие таблицы');
        resolve();
    });
};

exports.cleanTables = async function () {
    return new Promise(async (resolve, reject) => {
        await queryFunction('TRUNCATE TABLE pre_excel');
        await queryFunction('TRUNCATE TABLE pre_sellers');
        await queryFunction('TRUNCATE TABLE empty');
        logger.info('Очищаем претаблицы от данных');
        resolve();
    });
};

exports.cleanTablesSocket = async function () {
    return new Promise(async (resolve, reject) => {
        await queryFunction('TRUNCATE TABLE sellers');
        await queryFunction('TRUNCATE TABLE excel');
        await queryFunction('TRUNCATE TABLE empty');
        logger.info('Очищаем реальные таблицы от данных');
        resolve();
    });
};

exports.convertToCSV = function () {
    return new Promise(async resolve => {
        logger.info('Экспортируем в csv');
        const sql = `
                    SELECT 
                        'id',
                        'Продавец',
                        'Код товара',
                        'Цена',
                        'Наличие на складе',
                        'Опт или розница',
                        'excelId',
                        'Изготовитель',
                        'Название'
                    UNION ALL SELECT 
                        sellers.id,
                        sellers.seller as,
                        sellers.vendor_code,
                        sellers.price,
                        sellers.instock,
                        sellers.wholesale,
                        excel.id,
                        excel.manufacturer,
                        excel.name
                    FROM
                        sellers
                            LEFT JOIN
                        excel ON sellers.vendor_code = excel.vendor_code
                    INTO OUTFILE '${configuration.csv.path}${new Date().toString().replace(/[^\w\s]/gi, '')}.csv'
                    FIELDS TERMINATED BY ','
                    ENCLOSED BY '"'
                    LINES TERMINATED BY '\\n'`;

        await queryFunction(sql);
        resolve();
    });
};