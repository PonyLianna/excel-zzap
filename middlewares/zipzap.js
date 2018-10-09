const request = require('request');
const mysql = require('./database/database');
const api_key = require('./../config/config').api_key;

exports.GetSearchResultV2 = function (id, partnumber, class_man, name) {
    const options = {
        uri: 'https://www.zzap.ru/webservice/datasharing.asmx/GetSearchResultV2',
        method: 'POST',
        json: {
            'login': '',
            'password': '',
            'search_text': name,
            'partnumber': partnumber,
            'class_man': class_man,
            'location': 1,
            'row_count': 200,
            'type_request': 0,
            'api_key': api_key
        }
    };

    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    return new Promise((resolve, reject) => {
        console.log(options.json);
        request(options, async function (err, response) {
                await waitFor(500);
                if (err) throw err;
                const parsed = JSON.parse(response.body.d).table;
                console.log(parsed);
                try {
                    await mysql.addCodecat([id, parsed[0].code_cat]);
                    await asyncForEach(parsed, async function (table) {
                    if (table.local) {
                        await mysql.addNewSeller(table.class_user, partnumber,
                            table.price.replace('р.', '').replace(' ', ''),
                            table.instock, table.wholesale);
                    } else {
                        await console.log(table.class_user + ' is non-local!');
                    }
                    resolve();
                    });
                }
                catch (err) {
                    await mysql.addEmpty(id, partnumber);
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
