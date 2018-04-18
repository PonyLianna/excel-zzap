const CronJob = require('cron').CronJob;
const mysql = require('./database/databaseSocket');
const codecat = require('../middlewares/codecat');
const database = require('./database/database');

let max = 0;
let jobs = {};

exports.init = async function () {
    console.log(new Date());
    const result = await mysql.readData();
    result.forEach(function (data) {
        max = data.id;
        const time = new Date(data.time);
        console.log(max);
        console.log(time);
        jobs[max] = new CronJob(time, async function () {
            await database.cleanTablesSocket();
            await codecat.codecatTest('excel', 'sellers', await database.getAllProductsFilter());
            await database.findPrices();
            await mysql.delData(await exports.find(data.time));
        }, null, true);
    });
};

exports.add = function (time) {
    jobs[max] = new CronJob(new Date(time), async function () {
        await database.cleanTablesSocket();
        await codecat.codecatTest('excel', 'sellers', await database.getAllProductsFilter());
        await database.findPrices();
        await mysql.delData(await exports.find(time));
        console.log(await exports.find(time));
    }, null, true);
    max += 1;
};

exports.delete = function (id) {
    delete jobs[id];
};

exports.list = async function () {
    return new Promise(async function (resolve, reject) {
        const data = await mysql.readData();
        resolve(data);
    });
};

exports.find = async function (time) {
    return new Promise(async function (resolve, reject) {
        resolve(await mysql.findData(time));
    });
};
