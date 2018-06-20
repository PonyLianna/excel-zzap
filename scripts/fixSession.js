const mysql = require('../middlewares/database/init');
async function test() {
    await mysql.fixSession();
    console.log('Session Fixed');
}
test();