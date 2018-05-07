const mysql = require('../middlewares/database/database');
async function test() {
    await mysql.fixDatabase();
    console.log('Database Fixed');
}
test();