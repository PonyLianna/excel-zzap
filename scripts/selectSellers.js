const mysql = require('./../middlewares/database/database');

test();

async function test() {
    let sellers = await mysql.selectSellers();
    sellers.forEach(async function(row) {
        console.log(row.Продавец);
    })

}