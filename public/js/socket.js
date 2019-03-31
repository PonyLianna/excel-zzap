const $ = require('jquery');
const io = require('socket.io-client');

$(document).ready(function () {
    let block = 0;
    let socket = io.connect(location.href);

    socket.on('message', function (data) {
        $('#info').prepend('<p>' + data + '</p>');
    });

    socket.on('codecat', function (data) {
        let percent = 100/data.length;

        $('#info').prepend('<p>' + data.time + '</p>');
        if (!block) {
            if ((data.length > data.now) && ($('#process').hasClass('disabled'))) {
                $(".progress.determinate").width('0%');

                $('#date').text(new Date(data.startTime).toLocaleString('ru'));
                $("p#progress").text("1 / " + data.length);

                $("#preload-window").show("fast");
                $("#preload-invisible").show("fast");

                $('button').toggleClass('disabled');

                $("#process").toggleClass('red');
                $('button#stop').toggleClass('disabled');
            } else if (data.length === data.now) {
                $("div.determinate").width('100%');

                $('button').toggleClass('disabled');

                $("#preload-window").hide("fast");
                $("#preload-invisible").hide("fast");
                $('button#stop').toggleClass('disabled');
            } else {
                console.log(percent * data.now + '%');
                $("p#progress").text(data.now + " / " + data.length);
                $("div.determinate").width(percent * data.now + '%');
            }
        }
    });

    socket.on('time', function (data) {
        console.log(data);
        $('.collection').empty();
        data.forEach(function (one_data) {
            $('.collection').prepend('<li class="collection-item"><span>' + one_data.time + '</span><a class="secondary-content">' +
                'удалить</a></li>');
        });
    });

    socket.on('block', function () {
        $('button').toggleClass('disabled');
        block = 1;

        $("#preload-window").hide("fast");
        $("#preload-invisible").hide("fast");
    });

    $('#stop').click(function(e){
        e.preventDefault();
        socket.emit('stop', 1);
    });

    $('#buttontext').click(function () {
        const message = $('#text').val();
        socket.emit('answer', message);
    });

    $('#add').click(function () {
        let myTime = '';
        if (instances[0].getSelectedValues() == 'EVERYTIME'){
            myTime = '00 ' + instance2.minutes + ' ' + instance2.hours + ' ' + instance1.date.getDate() + ' * *';
            console.log(myTime);
        } else {
            myTime = instance1.toString() + ' ' + instance2.time + ':00';
            console.log(new Date(myTime));
        }
        socket.emit('time', myTime);
        console.log(myTime);
        $('.collection').prepend('<li class="collection-item z-depth-1"><span>' + myTime + '</span><a class="secondary-content">удалить</a>' +
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
        $('#info').prepend('<p>Сообщение отправляется...</p>');
    });

    $('#update').click(function (e) {
        e.preventDefault();
        const time = new Date();
        socket.emit('update', time);
    });

    $('#delete').click(function (e) {
        e.preventDefault();
        const time = new Date();
        socket.emit('delete', time);
    });

    $('#percentage').click(function (e) {
        e.preventDefault();
        $('button#stop').removeClass('disabled');
        block = 0;
        const time = new Date();
        socket.emit('update', time);
    });

    $(document).on('click', 'a.secondary-content', function (e) {
        const time = $(this).siblings('span').text();
        socket.emit('time_del', time);
        $(this).closest(".collection-item").remove();
    });
});