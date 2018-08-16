$(document).ready(function () {
    $('.datepicker-day-button').click(function () {
        if ($('#change-time').text() == 'EVERYTIME'){
            $('datepicker-controls').hide();
            console.log(1);
        }
    });

    $('.datepicker').click(function () {
        if ($('#change-time').text() == 'EVERYTIME') {
            instance1.open();
            $('.datepicker-controls[role="heading"]').hide();
        }
    });

    $('#time').click(function () {
        $("#window").show("fast");
        $("#window-invisible").show("fast");
    });

    $('#close').click(function () {
        $("#window").hide("fast");
        $("#window-invisible").hide("fast");
    });

    $('#window-invisible').click(function () {
        $("#window").hide("fast");
        $("#window-invisible").hide("fast");
    });

    $('#process').click(function () {
        $("#preload-window").show("fast");
        $("#preload-invisible").show("fast");
    });

    $('#preload-invisible').click(function () {
        $("#preload-window").hide("fast");
        $("#preload-invisible").hide("fast");
    });

    $('#options').click(function () {
        $(".btn-small.waves-effect.scale-transition").toggleClass("scale-out");
    });

    $('#form').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            success: function (answer) {
                $('div#info').prepend(
                    '<div>' + answer + '</div>');
            },
            error: function (answer) {
                $('div#info').html('<p>Error</p>');
                console.log(answer);
                alert('Fail');
            }
        });
    });



    $('#change-time').click(function () {
        $("#change-time").toggleClass('red');
        const $e = $(this);
        $e.text($e.text() === "EVERYTIME" ? direct() : everytime()).toggleClass("active");
        $('.datepicker-date-display').toggle();

        function direct() {
            instance1.options.format = 'yyyy-mm-dd';
            return "DIRECTTIME";
        }
        function everytime() {
            instance1.options.format = 'dd';
            return "EVERYTIME"
        }
    });
});