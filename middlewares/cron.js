const CronJob = require('cron').CronJob;
const mysql = require('./database/databaseSocket');
const codecat = require('../middlewares/codecat');
const database = require('./database/database');
const socket = require('../app/socket');
let max = 0;
let jobs = {};

exports.init = async function () {
    console.log(new Date());
    const result = await mysql.readData();
    result.forEach(function (data) {
        max = data.id;
        let time = '';
        let spec = 0;

        time = new Date(data.time);
        console.log(time);
        if (time == 'Invalid Date') {
            time = data.time;
            spec = 1;
            console.log('?');
        }

        console.log(max);
        console.log(time);
        jobs[max] = new CronJob(time, async function () {
            console.log('something');
            await database.cleanTablesSocket();
            await codecat.codecatTest('excel', 'sellers', await database.getAllProductsFilter());
            await database.findPrices('SELECT vendor_code FROM excel');
            if (spec == 0){
                await mysql.delData((await exports.find(time)[0]).time);
            }
            await socket.times();
        }, null, true);
    });
};

exports.add = function (time) {
    let newTime = '';
    let spec = 0;
    newTime = new Date(time);

    if (newTime == 'Invalid Date') {
        newTime = time;
        spec = 1;
        console.log('?');
    }

    jobs[max] = new CronJob(newTime, async function () {
        console.log('something');
        await database.cleanTablesSocket();
        await codecat.codecatTest('excel', 'sellers', await database.getAllProductsFilter());
        await database.findPrices('SELECT vendor_code FROM excel');
        console.log((await exports.find(time))[0].time);
        if (spec == 0) {
            await mysql.delData((await exports.find(time))[0].time);
        }
        await socket.times();
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
    return await mysql.findData(time);
};
