/**
 *  Users schema
 *
 *  Created by create caminte-cli script
 *  App based on CaminteJS
 *  CaminteJS homepage http://www.camintejs.com
 **/

/**
 *  Define Users Model
 *  @param {Object} schema
 *  @return {Object}
 **/
module.exports = function(schema){
    var Users = schema.define('users', {
         name: { type: schema.String, limit: 100 },
         password: { type: schema.String, limit: 255 }
    },{


    });

    // additional methods and validation here

    return Users;
};
