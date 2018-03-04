const http = require('http');
const request = require('request');
const mysql = require('./../middlewares/database');

exports.GetSearchSuggestV2 = function (id, partnumber, class_man) {
    global_id = id;
    global_partnumber = partnumber;
    const options = {
        uri: 'https://www.zzap.ru/webservice/datasharing.asmx/GetSearchResultV2',
        method: 'POST',
        json: {
            'login': '',
            'password': '',
            'search_text': '',
            'partnumber': partnumber,
            'class_man': class_man,
            'location': 1,
            'row_count': 200,
            'type_request': 0,
            'api_key': ''
        }
    };

    request(options, async function (error, response) {
        if (error) throw error;

        const parsed = JSON.parse(response.body.d).table;
        try {
            mysql.addCodecat([global_id, parsed[0].code_cat]);
            parsed.forEach(async function (table) {
                if (table.local == 1) {
                    await mysql.addNewSeller([table.class_user, global_partnumber, table.price.replace('р.', '').replace(' ', '')]);
                } else {
                    console.log(table.class_user + ' is non-local!');
                }
            })
        } catch (err) {
            await mysql.addEmpty([global_id, global_partnumber]);
            console.log('ID ' + global_id + ' is empty!');
        }
    });
};
