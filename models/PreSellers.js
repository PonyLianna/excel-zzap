/**
 *  PreSellers schema
 *
 *  Created by create caminte-cli script
 *  App based on CaminteJS
 *  CaminteJS homepage http://www.camintejs.com
 **/

/**
 *  Define PreSellers Model
 *  @param {Object} schema
 *  @return {Object}
 **/
module.exports = function(schema){
    var PreSellers = schema.define('pre_sellers', {
         seller: { type: schema.String, limit: 255 },
         vendor_code: { type: schema.String, limit: 100 },
         price: { type: schema.String },
         instock: { type: schema.Boolean, limit: 1 },
         wholesale: { type: schema.Boolean, limit: 1 }
    },{


    });

    // additional methods and validation here

    return PreSellers;
};
