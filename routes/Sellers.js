/**
 *  Sellers Routes
 *
 *  Created by create caminte-cli script
 *  App based on CaminteJS
 *  CaminteJS homepage http://www.camintejs.com
 **/
var _ = require('underscore');
var express = require('express');
var caminte = require('caminte');
var boom = require('boom');
var router = express.Router({mergeParams: true});
var middleware;

/* params router level */
router.param('seller_id', function (req, res, next, seller_id) {
   if (/^\d+$/.test(seller_id)) {
      next();
   } else {
      next('route');
   }
});

/* middleware router level */
if (middleware) {
   router.use(middleware);
}

/**
* Index action, returns a list either
* Default mapping to GET '~/sellers'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function list(req, res) {
    var Sellers = caminte.model('Sellers');
    var query = req.query;
    var skip = query.skip ? parseInt(query.skip) - 1 : 0;
    var limit = query.limit ? parseInt(query.limit) : 20;

    var opts = {
        skip: skip,
        limit: limit,
        where: {}
    };

    delete query.skip;
    delete query.limit;
    // TODO: it needs implementation for search
    _.extend(opts.where, query);

    Sellers.all(opts, function (err, sellers) {
        if (err) {
           res.status(400);
           return res.json(boom.badRequest(err.message || err).output.payload);
        }
        res.status(200);
        res.json(sellers);
    });
};

router.get('/', list);

/**
 * Count items action, returns amount of seller
 * Default mapping to GET '~/sellers/count'
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 **/
function count(req, res) {
    var Sellers = caminte.model('Sellers');
    var query = req.query;

    var opts = {
        where: {}
    };

    // TODO: it needs implementation
    _.extend(opts.where, query);

    Sellers.count(opts.where, function (err, count) {
        if (err) {
           res.status(400);
           return res.json(boom.badRequest(err.message || err).output.payload);
        }
        res.status( 200 );
        res.json( {
           count: count
        });
   });
}

router.get('/count', count);

/**
* New action, returns new a single seller
* Default mapping to GET '~/sellers/new'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function empty(req, res) {
    var Sellers = caminte.model('Sellers');
    var seller = new Sellers(req.query);
    res.status(200);
    res.json(seller.toObject());
}

router.get('/new', empty);

/**
* Show action, returns shows a single seller
* Default mapping to GET '~/sellers/:id'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function show(req, res) {
    var Sellers = caminte.model('Sellers');
    Sellers.findById(req.params.seller_id, function (err, seller) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (seller) {
            res.status(200);
            res.json(seller.toObject());
        } else {
            res.status(404);
            res.json(boom.notFound('seller not found').output.payload);
        }
    });
}

router.get('/:seller_id', show);

/**
* Update action, updates a single seller
* Default mapping to PUT '~/sellers/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function update(req, res) {
    var query = req.body;
    var Sellers = caminte.model('Sellers');
    Sellers.findById(req.params.seller_id, function (err, seller) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (seller) {

            _.extend(seller, query);

            seller.isValid(function (isValid) {
                if(isValid) {
                    seller.updateAttributes(req.body, function (err) {
                        if (err) {
                            res.status(400);
                            return res.json(boom.badRequest(err.message || err).output.payload);
                        }
                        res.status(200);
                        res.json(seller.toObject());
                    });
                } else {
                    res.status(422);
                    var error = boom.badData('data is bad you should fix it').output.payload;
                    error.attributes = seller.errors;
                    return res.json(error);
                }
            });
        } else {
            res.status(404);
            res.json(boom.notFound('seller not found').output.payload);
        }
    });
}

router.put('/:seller_id', update);

/**
* Create action, creates a single seller
* Default mapping to POST '~/sellers', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function create(req, res) {
    var Sellers = caminte.model('Sellers');
    var seller = new Sellers(req.body);
    seller.isValid(function (isValid) {
        if (!isValid) {
           res.status(422);
           var error = boom.badData('data is bad you should fix it').output.payload;
           error.attributes = seller.errors;
           return res.json(error);
        }
        seller.save(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            }
            res.status(201);
            res.json(seller.toObject());
        });
   });
}

router.post('/', create);

/**
* Delete action, deletes a single seller
* Default mapping to DEL '~/sellers/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function destroy(req, res) {
    var Sellers = caminte.model('Sellers');
    Sellers.findById(req.params.seller_id, function (err, seller) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (!seller) {
            res.status(404);
            return res.json(boom.notFound('seller not found').output.payload);
        }
        seller.destroy(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            } else {
               res.status(204);
               res.json({
                  message: 'sellers deleted!'
               });
            }
        });
    });
}

router.delete('/:seller_id', destroy);

/**
* Delete action, deletes a all sellers
* Default mapping to DEL '~/sellers', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function truncate(req, res) {
    var Sellers = caminte.model('Sellers');
    Sellers.destroyAll(function (err) {
        if (err) {
          res.status(400);
          return res.json(boom.badRequest(err.message || err).output.payload);
        } else {
          res.status(204);
          res.json({
            statusCode: 204,
            message: 'All sellers deleted'
          });
        }
    });
}

router.delete('/truncate', truncate);

module.exports = router;
