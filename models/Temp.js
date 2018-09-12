/**
 *  Temp schema
 *
 *  Created by create caminte-cli script
 *  App based on CaminteJS
 *  CaminteJS homepage http://www.camintejs.com
 **/

/**
 *  Define Temp Model
 *  @param {Object} schema
 *  @return {Object}
 **/
module.exports = function(schema){
    var Temp = schema.define('temp', {
         manufacturer: { type: schema.String, limit: 30 },
         vendor_code: { type: schema.String, limit: 100 },
         name: { type: schema.String, limit: 255 }
    },{


    });

    // additional methods and validation here

    return Temp;
};
