const mysql = require('mysql');
const configuration = require('../config/config');


function createDB(dbname) {
    return new Promise(async (resolve) => {
        let help_connection = await mysql.createConnection(configuration.dbconfig);
        help_connection.query("CREATE DATABASE " + dbname + " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
            function (err, result, fields) {
                if (err) console.log(err);
                console.log("CREATE DATABASE " + dbname + " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                help_connection.end();
                return resolve(result);
            });
    })
}

createDB(configuration.dbname);