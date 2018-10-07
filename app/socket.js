const cron = require('../middlewares/cron');
const email = require('../middlewares/postman');
const mysql = require('../middlewares/database/databaseSocket');
const init = require('../middlewares/database/init');
const database = require('../middlewares/database/database');
const manipulate = require('../middlewares/database/databaseManipulate');
const codecat = require('../middlewares/codecat');
const proc = require('../middlewares/dataProcessing');

exports.main = function (io) { // DEFAULT FUNCTION
    io.sockets.on('connection', async function (socket) {
        exports.log = function (i, massive, startTime) {
            const message = {"time": new Date().toUTCString() + ' ' + i, "length": massive.length, "now": i+1, startTime};
            console.log(message);
            socket.emit('codecat', message);
        };

        exports.times = async function() {
            socket.emit('time', await cron.list());
        };

        console.log('Присоединился клиент');
        socket.emit('message', 'Вы присоединены к серверу');

        exports.times();

        socket.broadcast.emit('message', 'Новый клиент присоединился к вам');

        socket.on('answer', function (message) {
            console.log(message + ' client ' + +' saying!');
            socket.emit('message', message);
        });

        socket.on('update', async function (time) {
            await database.cleanTablesSocket();
            await init.db_csv('main.csv', 'pre_excel');
            await codecat.codecat();
            await database.insertTables();
            await database.findPrices();
            socket.emit('message', 'База данных была обновлена')
        });

        socket.on('delete', async function (time) {
            await manipulate.truncateAll();
            socket.emit('message', 'База данных была удалена');
            console.log('База обновлена');
        });

        socket.on('time', function (message) {
            console.log('Добавлен таймер на ' + message);
            cron.add(message);
            mysql.addData(message);
        });

        socket.on('time_del', async function (message) {
            console.log('Удаляю таймер ' + message);
            let id = await cron.find(message);
            cron.delete(id);
            mysql.delData(message);
        });

        socket.on('data', async function (message) {
            console.log(message);
            await proc.altExport(await database.selectAll(), message.instock, message.wholesale);
            await email.sendMail(message.email, 'Excel ' + new Date(), '',
                `${require('../config/config').finalExcel.path}\\
                ${require('../config/config').finalExcel.name}.xlsx`);
            socket.emit('message', `Сообщение с параметрами: '${message.instock?"В наличии":"Под заказ"}, 
                        ${message.wholesale?"В розницу":"Оптом"}' отправлено на email: ${message.email}`)
        });
    });
};