/**
 *  Empty Routes
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
router.param('empty_id', function (req, res, next, empty_id) {
   if (/^\d+$/.test(empty_id)) {
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
* Default mapping to GET '~/empties'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function list(req, res) {
    var Empty = caminte.model('Empty');
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

    Empty.all(opts, function (err, empties) {
        if (err) {
           res.status(400);
           return res.json(boom.badRequest(err.message || err).output.payload);
        }
        res.status(200);
        res.json(empties);
    });
};

router.get('/', list);

/**
 * Count items action, returns amount of empty
 * Default mapping to GET '~/empties/count'
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 **/
function count(req, res) {
    var Empty = caminte.model('Empty');
    var query = req.query;

    var opts = {
        where: {}
    };

    // TODO: it needs implementation
    _.extend(opts.where, query);

    Empty.count(opts.where, function (err, count) {
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
* New action, returns new a single empty
* Default mapping to GET '~/empties/new'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function empty(req, res) {
    var Empty = caminte.model('Empty');
    var empty = new Empty(req.query);
    res.status(200);
    res.json(empty.toObject());
}

router.get('/new', empty);

/**
* Show action, returns shows a single empty
* Default mapping to GET '~/empties/:id'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function show(req, res) {
    var Empty = caminte.model('Empty');
    Empty.findById(req.params.empty_id, function (err, empty) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (empty) {
            res.status(200);
            res.json(empty.toObject());
        } else {
            res.status(404);
            res.json(boom.notFound('empty not found').output.payload);
        }
    });
}

router.get('/:empty_id', show);

/**
* Update action, updates a single empty
* Default mapping to PUT '~/empties/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function update(req, res) {
    var query = req.body;
    var Empty = caminte.model('Empty');
    Empty.findById(req.params.empty_id, function (err, empty) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (empty) {

            _.extend(empty, query);

            empty.isValid(function (isValid) {
                if(isValid) {
                    empty.updateAttributes(req.body, function (err) {
                        if (err) {
                            res.status(400);
                            return res.json(boom.badRequest(err.message || err).output.payload);
                        }
                        res.status(200);
                        res.json(empty.toObject());
                    });
                } else {
                    res.status(422);
                    var error = boom.badData('data is bad you should fix it').output.payload;
                    error.attributes = empty.errors;
                    return res.json(error);
                }
            });
        } else {
            res.status(404);
            res.json(boom.notFound('empty not found').output.payload);
        }
    });
}

router.put('/:empty_id', update);

/**
* Create action, creates a single empty
* Default mapping to POST '~/empties', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function create(req, res) {
    var Empty = caminte.model('Empty');
    var empty = new Empty(req.body);
    empty.isValid(function (isValid) {
        if (!isValid) {
           res.status(422);
           var error = boom.badData('data is bad you should fix it').output.payload;
           error.attributes = empty.errors;
           return res.json(error);
        }
        empty.save(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            }
            res.status(201);
            res.json(empty.toObject());
        });
   });
}

router.post('/', create);

/**
* Delete action, deletes a single empty
* Default mapping to DEL '~/empties/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function destroy(req, res) {
    var Empty = caminte.model('Empty');
    Empty.findById(req.params.empty_id, function (err, empty) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (!empty) {
            res.status(404);
            return res.json(boom.notFound('empty not found').output.payload);
        }
        empty.destroy(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            } else {
               res.status(204);
               res.json({
                  message: 'empties deleted!'
               });
            }
        });
    });
}

router.delete('/:empty_id', destroy);

/**
* Delete action, deletes a all emptys
* Default mapping to DEL '~/empties', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function truncate(req, res) {
    var Empty = caminte.model('Empty');
    Empty.destroyAll(function (err) {
        if (err) {
          res.status(400);
          return res.json(boom.badRequest(err.message || err).output.payload);
        } else {
          res.status(204);
          res.json({
            statusCode: 204,
            message: 'All empties deleted'
          });
        }
    });
}

router.delete('/truncate', truncate);

module.exports = router;
