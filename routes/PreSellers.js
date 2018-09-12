/**
 *  PreSellers Routes
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
router.param('preseller_id', function (req, res, next, preseller_id) {
   if (/^\d+$/.test(preseller_id)) {
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
* Default mapping to GET '~/presellers'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function list(req, res) {
    var PreSellers = caminte.model('PreSellers');
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

    PreSellers.all(opts, function (err, presellers) {
        if (err) {
           res.status(400);
           return res.json(boom.badRequest(err.message || err).output.payload);
        }
        res.status(200);
        res.json(presellers);
    });
};

router.get('/', list);

/**
 * Count items action, returns amount of preseller
 * Default mapping to GET '~/presellers/count'
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 **/
function count(req, res) {
    var PreSellers = caminte.model('PreSellers');
    var query = req.query;

    var opts = {
        where: {}
    };

    // TODO: it needs implementation
    _.extend(opts.where, query);

    PreSellers.count(opts.where, function (err, count) {
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
* New action, returns new a single preseller
* Default mapping to GET '~/presellers/new'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function empty(req, res) {
    var PreSellers = caminte.model('PreSellers');
    var preseller = new PreSellers(req.query);
    res.status(200);
    res.json(preseller.toObject());
}

router.get('/new', empty);

/**
* Show action, returns shows a single preseller
* Default mapping to GET '~/presellers/:id'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function show(req, res) {
    var PreSellers = caminte.model('PreSellers');
    PreSellers.findById(req.params.preseller_id, function (err, preseller) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (preseller) {
            res.status(200);
            res.json(preseller.toObject());
        } else {
            res.status(404);
            res.json(boom.notFound('preseller not found').output.payload);
        }
    });
}

router.get('/:preseller_id', show);

/**
* Update action, updates a single preseller
* Default mapping to PUT '~/presellers/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function update(req, res) {
    var query = req.body;
    var PreSellers = caminte.model('PreSellers');
    PreSellers.findById(req.params.preseller_id, function (err, preseller) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (preseller) {

            _.extend(preseller, query);

            preseller.isValid(function (isValid) {
                if(isValid) {
                    preseller.updateAttributes(req.body, function (err) {
                        if (err) {
                            res.status(400);
                            return res.json(boom.badRequest(err.message || err).output.payload);
                        }
                        res.status(200);
                        res.json(preseller.toObject());
                    });
                } else {
                    res.status(422);
                    var error = boom.badData('data is bad you should fix it').output.payload;
                    error.attributes = preseller.errors;
                    return res.json(error);
                }
            });
        } else {
            res.status(404);
            res.json(boom.notFound('preseller not found').output.payload);
        }
    });
}

router.put('/:preseller_id', update);

/**
* Create action, creates a single preseller
* Default mapping to POST '~/presellers', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function create(req, res) {
    var PreSellers = caminte.model('PreSellers');
    var preseller = new PreSellers(req.body);
    preseller.isValid(function (isValid) {
        if (!isValid) {
           res.status(422);
           var error = boom.badData('data is bad you should fix it').output.payload;
           error.attributes = preseller.errors;
           return res.json(error);
        }
        preseller.save(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            }
            res.status(201);
            res.json(preseller.toObject());
        });
   });
}

router.post('/', create);

/**
* Delete action, deletes a single preseller
* Default mapping to DEL '~/presellers/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function destroy(req, res) {
    var PreSellers = caminte.model('PreSellers');
    PreSellers.findById(req.params.preseller_id, function (err, preseller) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (!preseller) {
            res.status(404);
            return res.json(boom.notFound('preseller not found').output.payload);
        }
        preseller.destroy(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            } else {
               res.status(204);
               res.json({
                  message: 'presellers deleted!'
               });
            }
        });
    });
}

router.delete('/:preseller_id', destroy);

/**
* Delete action, deletes a all presellers
* Default mapping to DEL '~/presellers', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function truncate(req, res) {
    var PreSellers = caminte.model('PreSellers');
    PreSellers.destroyAll(function (err) {
        if (err) {
          res.status(400);
          return res.json(boom.badRequest(err.message || err).output.payload);
        } else {
          res.status(204);
          res.json({
            statusCode: 204,
            message: 'All presellers deleted'
          });
        }
    });
}

router.delete('/truncate', truncate);

module.exports = router;
