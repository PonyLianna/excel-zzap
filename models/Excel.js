    /**
 *  Excel schema
 *
 *  Created by create caminte-cli script
 *  App based on CaminteJS
 *  CaminteJS homepage http://www.camintejs.com
 **/

/**
 *  Define Excel Model
 *  @param {Object} schema
 *  @return {Object}
 **/
module.exports = function(schema){
    var Excel = schema.define('excel', {
         manufacturer: { type: schema.String, limit: 40 },
         vendor_code: { type: schema.String, limit: 100 },
         name: { type: schema.String, limit: 255 },
         code_cat: { type: schema.String, limit: 20 },
         min_price: { type: schema.String },
         avg_price: { type: schema.String },
         max_price: { type: schema.String }
    },{


    });

    // additional methods and validation here

    return Excel;
};
