let token = sessionStorage.token;
let socket = io.connect('http://localhost:8080');

socket.on('connect', function () {
    socket.emit('authentication', {username: "John", password: "secret"});
    socket.on('authenticated', function () {
        $('#info').append('<p>' + data + '</p>');
    });
});

socket.on('message', function (data) {
    $('#info').append('<p>' + data + '</p>');
});

$('#textbutton').click(function () {
    const message = $('#text').val();
    socket.emit('answer', message);
});