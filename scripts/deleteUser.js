const mysql = require('../middlewares/database/init');

async function deleteUser() {
    const slice = process.argv.slice(2);
    console.log('Username: ' + slice[0]);
    return await mysql.deleteUser(slice[0]);
}

deleteUser();