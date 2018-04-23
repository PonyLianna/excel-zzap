const mysql = require('./../middlewares/database/init');

async function test() {
    await mysql.db_csv("null.csv", "excel");
}

test();