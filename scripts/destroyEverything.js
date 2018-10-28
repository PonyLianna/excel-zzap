const mysql = require('./../middlewares/database/init');

async function main() {
    await mysql.destroyEverything('excel', 'pre_excel', 'users', 'sessions', 'sellers', 'pre_sellers',
        'empty', 'pre_empty', 'times');
    console.log('Database was destroyed');
}

main();

