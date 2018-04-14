$(document).ready(function () {
    $('#time').click(function () {
        $("#window").show("fast");
        $("#window-invisible").show("fast");
    });

    $('#window-invisible').click(function () {
        $("#window").hide("fast");
        $("#window-invisible").hide("fast");
    });

    $('#options').click(function () {
        $("#update").toggleClass("scale-out");
        $("#delete").toggleClass("scale-out");
    });

    $('#form').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            success: function (answer) {
                $('div#info').append(
                    '<div>' + answer + '</div>');
            },
            error: function (answer) {
                $('div#info').html('<p>Error</p>');
                console.log(answer);
                alert('Fail');
            }
        });
    });
});