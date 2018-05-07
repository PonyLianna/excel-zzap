const mysql = require('mysql');
const config = require('../../config/db').pool_config;
pool = mysql.createPool(config);
// let pool;
//
// function handlePool() {
//     pool = mysql.createPool(config);
//
//     pool.getConnection(function (err, connection) {
//         if (err) {
//             console.log("error while connecting to db");
//             setTimeout(handlePool(), 2000);
//             connection.release();
//         }
//         connection.on('error', function (err) {
//             console.log('Connection problem');
//             handlePool();
//         });
//     })
// }
//
// handlePool();

let queryFunction = function (sql, time) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, [time], function (err, result, fields) {
                if (err) throw err;
                connection.release();
                resolve(result);
            });
        });
    });
};

exports.addData = function (time) {
    console.log(time);
    queryFunction('INSERT INTO times (time) VALUES (?)', time);
};

exports.delData = function (time) {
    queryFunction('DELETE FROM times WHERE time = ?', time);
};

exports.readData = async function () {
    return await queryFunction('SELECT * FROM times');
};

exports.findData = async function (time) {
    return await queryFunction('SELECT * FROM times where time = ?', time);
};