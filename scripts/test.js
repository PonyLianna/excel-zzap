const database = require('../middlewares/database/database');

async function start(){
    console.log(await database.queryFunction('select * from pre_sellers'));
}

start();