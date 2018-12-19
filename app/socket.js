const cron = require('../middlewares/cron');
const mysql = require('../middlewares/database/databaseSocket');
const init = require('../middlewares/database/init');
const database = require('../middlewares/database/database');
const manipulate = require('../middlewares/database/databaseManipulate');
const codecat = require('../middlewares/codecat');

exports.main = function (io) { // DEFAULT FUNCTION
    io.sockets.on('connection', async function (socket) {
        exports.log = function (i, massive, startTime) {
            const message = {
                "time": new Date().toUTCString() + ' ' + i,
                "length": massive.length,
                "now": i + 1,
                startTime
            };

            logger.debug(message);
            if (!stop){
                socket.emit('codecat', message);
                socket.broadcast.emit('codecat', message);
            }
        };

        exports.times = async function () {
            socket.emit('time', await cron.list());
            socket.broadcast.emit('time', await cron.list());
        };

        logger.info('К socket серверу присоединился клиент');
        socket.emit('message', 'Вы присоединены к серверу');

        exports.times();

        socket.broadcast.emit('message', 'Новый клиент присоединился к вам');
        
        socket.on('stop', function () {
            stop = true;

            socket.emit('message', 'Процесс остановлен');
            socket.broadcast.emit('message', 'Процесс остановлен');

            socket.emit('block', 1);
            socket.broadcast.emit('block', 1);
        });

        socket.on('update', async function () {
            stop = false;

            await database.cleanTablesSocket();
            await init.db_csv('main.csv', 'pre_excel');
            await codecat.codecat();

            if (!stop){
                await database.insertTables();
                await database.convertToCSV();

                socket.emit('message', 'База данных была обновлена');
                socket.broadcast.emit('message', 'База данных была обновлена');
            }
        });

        socket.on('delete', async function (time) {
            await manipulate.truncateAll();
            socket.emit('message', 'База данных была очищена');
            socket.broadcast.emit('message', 'База данных была очищена');
            logger.info('База обновлена');
        });

        socket.on('time', function (message) {
            logger.info('Добавлен таймер на ' + message);
            cron.add(message);
            mysql.addData(message);
            socket.emit('message', `Добавлен таймер на ${message}`);
            socket.broadcast.emit('message', `Добавлен таймер на ${message}`);
        });

        socket.on('time_del', async function (message) {
            logger.info('Удаляю таймер ' + message);
            let id = await cron.find(message);
            cron.delete(id);
            mysql.delData(message);
        });

        socket.on('data', async function (message) {
            let text = `Данные оохранены`;
            await database.convertToCSV();

            socket.emit('message', text);
            socket.broadcast.emit('message', text);
            logger.info(text);
        });
    });
};