const request = require('request');
const mysql = require('./../middlewares/database/database');

exports.GetSearchResultV2 = function (id, partnumber, class_man, excelTable, sellersTable) {
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

    return new Promise((resolve, reject) => {
        request(options, async function (err, response) {
                if (err) throw err;
                const parsed = JSON.parse(response.body.d).table;
                try {
                    await mysql.addCodecat([id, parsed[0].code_cat], excelTable);
                    parsed.forEach(async function (table) {
                        if (table.local == 1) {
                            await mysql.addNewSeller([table.class_user, partnumber,
                                table.price.replace('р.', '').replace(' ', ''),
                                parsed[0].instock, parsed[0].wholesale], sellersTable);
                        } else {
                            await console.log(table.class_user + ' is non-local!');
                        }
                        resolve();
                    });
                }
                catch (err) {
                    mysql.addEmpty([id, partnumber]);
                    console.log('ID ' + id + ' is empty!');
                    console.log(JSON.parse(response.body.d).error);
                    if (JSON.parse(response.body.d).error) {
                        console.log(response.body.d.error);
                        return reject(response.body.d.error);
                    } else {
                        return resolve();
                    }
                }
            }
        );
    });

};
