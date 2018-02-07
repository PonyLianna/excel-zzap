$(document).ready(function() {
    $('#form').submit(function(e){
        e.preventDefault();
        //$.ajax
        $(this).ajaxSubmit({ // Ajax request
                success: function (answer) {
                    $('div#info').append(
                    '<div>'+ answer +'</div>');
                },
                error: function (answer) {
                    $('div#info').html("<p>Error</p>");
                    console.log(answer);
                    alert("Fail");
                }
        });
    });
});