const cron = require('../middlewares/cron');
const email = require('../middlewares/postman');
const mysql = require('../middlewares/database/databaseSocket');

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

        socket.on('time', function (message) {
            console.log('TIME IS ' + message);
            cron.add(new Date(message));
            mysql.addData(message);
        });

        socket.on('time_del', async function (message) {
            console.log('DELETING TIME ' + message);
            let id = await cron.find(message);
            cron.delete(id);
            mysql.delData(message);
        });

        socket.on('data', function (message) {
            function date() {
                return new Date();
            }
            // function getHighestFile() {
            //     fs.readdir('../final', (err, files) => {
            //         files.forEach(file => {
            //             console.log(file);
            //         });
            //     })
            // }
            email.sendMail(message.email, 'Excel ' + date(), '', __dirname + '/../final/finalwithsellers.xlsx');
        });
    });
};
