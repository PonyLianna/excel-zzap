// const zipzap = require('./../config/zipzap');
// const mysql = require('./../middlewares/database/database');
const codecat = require('./../middlewares/codecat');

codecat.codecat('pre_excel', 'pre_sellers');
// async function asyncForEach(array, callback) {
//     for (let index = 0; index < array.length; index++) {
//         await callback(array[index], index, array)
//     }
// }

// function getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
// }

// const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
// test();
//
// function test() {
//     mysql.getAllProductsLarge().then(async function (products) {
//             let time = (products.length * 3);
//             console.log('Общее время выполнения: ' + time + ' секунд');
//
//             asyncForEach(products, async function (product) {
//                 await waitFor(3200);
//                 request(product.id, product.Артикул, product.Производитель)
//                     .catch((err) => {
//                         console.log('test');
//                         return new Promise.reject(err);
//                     });
//             }).catch(async (err) => {
//                 console.log('nextlvl');
//                 console.log(err + ' but continue!');
//                 await waitFor(4000);
//                 test();
//                 return;
//             })
//         }
//     );
// }
//
// async function request(id, partnumber, class_man) {
//     console.log(id + ' ' + class_man + ' ' + partnumber);
//     await zipzap.GetSearchSuggestV2(id, partnumber, class_man)
//         .catch((err) => {
//             console.log('Пиздарики');
//             return new Promise.reject(err);
//         })
// }

