// var CronJob = require('cron').cronJob;
//
const my_data = new Date('Fri Apr 13 2018 16:49:00 GMT-0400 (EDT)');

console.log(new Date());
console.log(my_data);
const job = {};
//
// var job = new CronJob({
//     cronTime: '*/30 * * * * *',
//     onTick: function() {
//         console.log('hallo')
//     },
//     start: false,
//     timeZone: 'America/Los_Angeles'
// });
// job.start();

// var CronJob = require('cron').CronJob;
// new CronJob('* * * * * *', function() {
//     console.log('You will see this message every second');
// }, null, true, 'America/Los_Angeles');

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
// console.log(job);
// class job {
//     async constructor() {
//         this.jobs = {};
//     //     await mysql.readData().forEach(function (data) {
//     //         this.max = data.id;
//     //         this.jobs[data.id] = new CronJob(time, function () {
//     //             console.log('test');
//     //         }, null, true);
//     //     });
//     // }
//
//     static delete(id){
//         delete this.jobs[id];
//     }
//
//     static add(time){
//         this.jobs[this.max] = new CronJob(time, function () {
//             console.log('test');
//         }, null, true);
//     }
// }
