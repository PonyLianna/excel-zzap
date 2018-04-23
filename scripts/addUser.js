const mysql = require('../middlewares/database/init');
async function addUser() {
    const slice = process.argv.slice(2);

    console.log('Username: ' + slice[0]);
    console.log('Password: ' + slice[1]);

    if (slice[2] == 1) {
        console.log('Admin');
    }

    return await mysql.createUser(slice[0], slice[1], slice[2]);
}

addUser();