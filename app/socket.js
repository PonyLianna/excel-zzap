module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        console.log('Client is connected!');
        socket.emit('message', 'You are connected to server');
        socket.broadcast.emit('message', 'New Client is connected');

        socket.on('answer', function (message) {
            console.log(message + ' client ' + +' saying!');
            socket.emit('message', message);
        });
    });

};
