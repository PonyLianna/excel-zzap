/**
 *  Times schema
 *
 *  Created by create caminte-cli script
 *  App based on CaminteJS
 *  CaminteJS homepage http://www.camintejs.com
 **/

/**
 *  Define Times Model
 *  @param {Object} schema
 *  @return {Object}
 **/
module.exports = function(schema){
    var Times = schema.define('times', {
         time: { type: schema.String, limit: 50 }
    },{


    });

    // additional methods and validation here

    return Times;
};
