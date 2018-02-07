$(document).ready(function() {

//$("button#send").click(function(e){
$('#form').submit(function(e){
    e.preventDefault();
//    var data = new FormData();
//    jQuery.each(jQuery('input#excel')[0].files, function(i, file) {
//        data.append('file-'+i, file);
//    });

    // On button click start ajax
//    e.preventDefault(); // disable page reload on button submit
//    console.log(data,
//                $('select#location').val(),
//                $('input#instock').val(),
//                $('input#wholesale').val(),
//                $('input#email').val())

    //$.ajax
    $(this).ajaxSubmit({ // Ajax request
//            type: 'POST',
//            url: '/',
//            data: {
//                file: data,
//                location: $('select#location').val(),
//                instock: $('input#instock').val(),
//                wholesale: $('input#wholesale').val(),
//                email: $('input#email').val()
//            },
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