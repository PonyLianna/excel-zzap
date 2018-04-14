let socket = io.connect('http://localhost:8080');

socket.on('connect', function () {
    socket.emit('authentication', {username: 'John', password: 'secret'});
    socket.on('authenticated', function () {
        $('#info').append('<p>' + data + '</p>');
    });
});

socket.on('message', function (data) {
    $('#info').append('<p>' + data + '</p>');
});

socket.on('time', function (data) {
    console.log(data);
    data.forEach(function (one_data) {
        $('.collection').append('<li class="collection-item"><span>' + one_data.time + '</span><a class="secondary-content">' +
            'Delete</a></li>');
    });
});

$('#buttontext').click(function () {
    const message = $('#text').val();
    socket.emit('answer', message);
});

$('#add').click(function () {
    const time = instance1.toString() + ' ' + instance2.time + ':00';
    console.log( new Date(time));
    socket.emit('time', time);
    $('.collection').append('<li class="collection-item z-depth-1"><span>' + time + '</span><a class="secondary-content">Delete</a>' +
        '</li>');
});

$('#parsedButton').click(function (e) {
    e.preventDefault();
    const data = {
        'instock': $('input[name=instock]:checked').val(),
        'wholesale': $('input[name=wholesale]:checked').val(),
        'email': $('#email').val()
    };
    socket.emit('data', data);
    console.log('Sended');
});

$(document).on('click','a.secondary-content',function(e) {
    const time = $(this).siblings('span').text();
    socket.emit('time_del', time);
    $(this).closest(".collection-item").remove();
});