//$('button#send').click(function(e){
$('button#apiSearch').click(function(e){
    e.preventDefault();
    $.ajax({ // Ajax request
            type: 'POST',
            url: 'http://www.zzap.ru/webservice/datasharing.asmx/GetRegions',
        contentType: 'application/json',
            data: {
                api_key: 'EAAAALRSFqwHazWMT+rWfB6MqOt424IIppSAgarD5XEelRRbX6nJuNnuKuPl113/5M+g4A=='
            },
            success: function(answer){
                $('textarea#apiSearchText').value = answer;
            },
            error: function (answer) {
                console.log(answer);
                alert('Fail');
            }
        });
    });