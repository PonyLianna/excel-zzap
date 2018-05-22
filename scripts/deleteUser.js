const mysql = require('../middlewares/database/init');
const database = require('../middlewares/database/database');
async function deleteUser() {
    const slice = process.argv.slice(2);

    console.log('Username: ' + slice[0]);
    return await database.fixSession();
}

deleteUser();