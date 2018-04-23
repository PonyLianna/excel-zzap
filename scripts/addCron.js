// var CronJob = require('cron').cronJob;
//
const my_data = "00 54 10 23 * *";

console.log(new Date());
console.log(my_data);
const job = {};

const CronJob = require('cron').CronJob;

job[1] = new CronJob(my_data, function() {
        console.log('You will see this message every second');
    }, null, true
);

job[2] = new CronJob(my_data, function() {
        console.log('You will see this message every second');
    }, null, true
);

job[3] = new CronJob(my_data, function() {
        console.log('You will see this message every second');
    }, null, true
);

