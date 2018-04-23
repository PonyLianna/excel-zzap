const mysql = require('../middlewares/database/database');
async function test() {
    await mysql.fixSession();
    console.log('Fixed');
}
test();