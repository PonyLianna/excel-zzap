const zipzap = require('./../config/zipzap');
const mysql = require('./../middlewares/database/database');

mysql.getAllProducts().then(function (res) {
    const number = 900;
    console.log(res[number].id, res[number].Производитель, res[number].Артикул);
    zipzap.GetSearchSuggestV2(res[number].id, res[number].Артикул, res[number].Производитель);
});