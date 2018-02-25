// // We need this to build our post string
// const querystring = require('querystring');
const http = require('http');
// const fs = require('fs');
// const xml2js = require('xml2js');
// const DomParser = require('dom-parser');
// parser = new DomParser();
// const parser = new xml2js.Parser();
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
    request(options, function (error, response, body) {
        if (error) throw error;

        const parsed = JSON.parse(response.body.d).table;
        // console.log(parsed.table[1]);
        parsed.forEach(function (table) {
            try {
                mysql.addCodecat([global_id, table.code_cat]);
                mysql.addNewSeller([table.class_user, global_partnumber, table.price.replace('р.', '').replace(' ', '')]);
            } catch (err) {
                console.log('ID ' + global_id + ' is empty!');
            }
        });
    });

};
