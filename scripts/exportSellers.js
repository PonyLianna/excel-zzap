const mysql = require('./../middlewares/database/database');
const xlsx = require('xlsx');

const name = "sheetjs";

const filename = "./final/sellers.xlsx";

save(name, filename);

async function save(name, filename) {
    const info = await mysql.selectSellers();
    console.log('MySQL is here');
    const wb = await xlsx.utils.book_new();
    console.log('Book created');
    const ws = await xlsx.utils.json_to_sheet(info);
    console.log('To sheet ended');
    await xlsx.utils.book_append_sheet(wb, ws, name);
    console.log('Saved');
    xlsx.writeFileSync(wb, filename);
    console.log('Everything is here!');
}