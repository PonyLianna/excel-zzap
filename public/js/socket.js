$(document).ready(function () {
    let socket = io.connect('http://localhost:8080');
    socket.on('message', function (data) {
        $('#info').append('<p>' + data + '</p>');
    });

    socket.on('codecat', function (data) {
        let percent = Math.floor(100/data.length);

        $('#info').append('<p>' + data.time + '</p>');
        if ((data.length > data.now) && ($('#process').hasClass('disabled'))) {
            $(".progress.determinate").width('0%');
            $('#date').text(data.time);
            $("p#progress").text("1 / " + data.length);

            $("#preload-window").show("fast");
            $("#preload-invisible").show("fast");

            $('button').toggleClass('disabled');
            $("#process").toggleClass('red');
        }
        else if (data.length === data.now) {
            $("div.determinate").width('100%');

            $('button').toggleClass('disabled');

            $("#preload-window").hide("fast");
            $("#preload-invisible").hide("fast");
        }
        else {
            console.log(percent*data.now + '%');
            $("p#progress").text(data.now + " / " + data.length);
            $("div.determinate").width(percent * data.now + '%');
        }
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
        let myTime = '';
        if ($('#change-time').text() == 'EVERYTIME'){
            myTime = '00 ' + instance2.minutes + ' ' + instance2.hours + ' ' + instance1.date.getDate() + ' * *';
            console.log(myTime);
        } else {
            myTime = instance1.toString() + ' ' + instance2.time + ':00';
            console.log(new Date(myTime));
        }
        socket.emit('time', myTime);
        console.log(myTime);
        $('.collection').append('<li class="collection-item z-depth-1"><span>' + myTime + '</span><a class="secondary-content">Delete</a>' +
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

    $(document).on('click', 'a.secondary-content', function (e) {
        const time = $(this).siblings('span').text();
        socket.emit('time_del', time);
        $(this).closest(".collection-item").remove();
    });
});