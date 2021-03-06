const CronJob = require('cron').CronJob;
const mysql = require('./database/databaseSocket');
const codecat = require('../middlewares/codecat');
const database = require('./database/database');
const init = require('./database/init');
const socket = require('../app/socket');

let max = 0;
let jobs = {};

exports.init = async function () {
    const result = await mysql.readData();
    if (result) {
        for (let data of result) {
            max = data.id;
            let time = '';
            let spec = 0;

            time = new Date(data.time);
            logger.debug(time);
            if (time == 'Invalid Date') {
                time = data.time;
                spec = 1;
            }

            jobs[max] = new CronJob(time, async function () {
                await database.cleanTablesSocket();
                await init.db_csv('main.csv', 'pre_excel');
                await codecat.codecat();
                await database.insertTables();
                await database.findPrices();
                if (!spec) await mysql.delData((await exports.find(time)[0]).time);
                await socket.times();
            }, null, true);
        }
    }
};

exports.add = function (time) {
    let newTime = '';
    let spec = 0;

    newTime = new Date(time);

    if (newTime == 'Invalid Date') {
        newTime = time;
        spec = 1;
    }

    jobs[max] = new CronJob(newTime, async function () {
        await database.cleanTablesSocket();
        await init.db_csv('main.csv', 'pre_excel');
        await codecat.codecat();
        await database.insertTables();
        await database.findPrices();
        logger.debug((await exports.find(time))[0].time);
        if (!spec) await mysql.delData((await exports.find(time))[0].time);
        await socket.times();
    }, null, true);
    max += 1;
};

exports.delete = function (id) {
    delete jobs[id];
};

exports.list = async function () {
    return new Promise(async resolve => {
        const data = await mysql.readData();
        resolve(data);
    });
};

exports.find = async function (time) {
    return await mysql.findData(time);
};