/**
 *  Empty schema
 *
 *  Created by create caminte-cli script
 *  App based on CaminteJS
 *  CaminteJS homepage http://www.camintejs.com
 **/

/**
 *  Define Empty Model
 *  @param {Object} schema
 *  @return {Object}
 **/
module.exports = function(schema){
    var Empty = schema.define('empty', {
         vendor_code: { type: schema.String, limit: 100 }
    },{


    });

    // additional methods and validation here

    return Empty;
};
