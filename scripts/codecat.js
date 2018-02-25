const zipzap = require('./../config/zipzap');
const mysql = require('./../middlewares/database');
const my_async = require('async');


mysql.getAllProducts().then(function (products) {
    let time = (products.length * 5) / 60;
    console.log('Общее время выполнения: ' + time + ' минут');
    my_async.eachSeries(products, function (product, callback) {
        setTimeout(function () {
            request(product.id, product.Артикул, product.Производитель);
            callback();
        }, 5000);
    });
    // for (let i = 0; i < products.length; i++) {
    //     request(products[i].id, products[i].Артикул, products[i].Производитель);
    // }
});

function request(id, partnumber, class_man) {
    zipzap.GetSearchSuggestV2(id, partnumber, class_man);
    console.log(id + ' ' + class_man + ' ' + partnumber);
}

