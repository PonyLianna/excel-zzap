const database = require('../middlewares/database/database');
async function start() {
    await database.findPrices();
    console.log('It\'s all folks');
}

start();
