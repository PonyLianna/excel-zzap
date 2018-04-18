const cron = require('../middlewares/cron');
const email = require('../middlewares/postman');
const mysql = require('../middlewares/database/databaseSocket');
const database = require('../middlewares/database/database');
const manipulate = require('../middlewares/database/databaseManipulate');
const codecat = require('../middlewares/codecat');
const proc = require('../middlewares/dataProcessing');

module.exports = function (io) {
    io.sockets.on('connection', async function (socket) {
        console.log('Client is connected!');
        socket.emit('message', 'You are connected to server');

        socket.emit('time', await cron.list());

        socket.broadcast.emit('message', 'New Client is connected');

        socket.on('answer', function (message) {
            console.log(message + ' client ' + +' saying!');
            socket.emit('message', message);
        });

        socket.on('update', async function (time) {
            await database.cleanTablesSocket();
            await codecat.codecatTest('excel', 'sellers', await database.getAllProductsFilter());
            await database.insertTables();
            await database.findPrices();
        });

        socket.on('delete',async function (time) {
            await manipulate.destroyAll();
            await manipulate.createAll();
            await manipulate.csv();
            await manipulate.createUsers();

            console.log('RECREATED');
        });

        socket.on('time', function (message) {
            console.log('TIME IS ' + message);
            cron.add(message);
            mysql.addData(message);
        });

        socket.on('time_del', async function (message) {
            console.log('DELETING TIME ' + message);
            let id = await cron.find(message);
            cron.delete(id);
            mysql.delData(message);
        });

        socket.on('data', async function (message) {
            console.log(message);
            await proc.altExport(await database.selectAll(), message.instock, message.wholesale);
            await email.sendMail(message.email, 'Excel ' + new Date(), '', __dirname + '/../final/final.xlsx');
        });
    });
};
