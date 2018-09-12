/**
 *  PreExcel Routes
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
router.param('preexcel_id', function (req, res, next, preexcel_id) {
   if (/^\d+$/.test(preexcel_id)) {
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
* Default mapping to GET '~/preexcels'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function list(req, res) {
    var PreExcel = caminte.model('PreExcel');
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

    PreExcel.all(opts, function (err, preexcels) {
        if (err) {
           res.status(400);
           return res.json(boom.badRequest(err.message || err).output.payload);
        }
        res.status(200);
        res.json(preexcels);
    });
};

router.get('/', list);

/**
 * Count items action, returns amount of preexcel
 * Default mapping to GET '~/preexcels/count'
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 **/
function count(req, res) {
    var PreExcel = caminte.model('PreExcel');
    var query = req.query;

    var opts = {
        where: {}
    };

    // TODO: it needs implementation
    _.extend(opts.where, query);

    PreExcel.count(opts.where, function (err, count) {
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
* New action, returns new a single preexcel
* Default mapping to GET '~/preexcels/new'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function empty(req, res) {
    var PreExcel = caminte.model('PreExcel');
    var preexcel = new PreExcel(req.query);
    res.status(200);
    res.json(preexcel.toObject());
}

router.get('/new', empty);

/**
* Show action, returns shows a single preexcel
* Default mapping to GET '~/preexcels/:id'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function show(req, res) {
    var PreExcel = caminte.model('PreExcel');
    PreExcel.findById(req.params.preexcel_id, function (err, preexcel) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (preexcel) {
            res.status(200);
            res.json(preexcel.toObject());
        } else {
            res.status(404);
            res.json(boom.notFound('preexcel not found').output.payload);
        }
    });
}

router.get('/:preexcel_id', show);

/**
* Update action, updates a single preexcel
* Default mapping to PUT '~/preexcels/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function update(req, res) {
    var query = req.body;
    var PreExcel = caminte.model('PreExcel');
    PreExcel.findById(req.params.preexcel_id, function (err, preexcel) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (preexcel) {

            _.extend(preexcel, query);

            preexcel.isValid(function (isValid) {
                if(isValid) {
                    preexcel.updateAttributes(req.body, function (err) {
                        if (err) {
                            res.status(400);
                            return res.json(boom.badRequest(err.message || err).output.payload);
                        }
                        res.status(200);
                        res.json(preexcel.toObject());
                    });
                } else {
                    res.status(422);
                    var error = boom.badData('data is bad you should fix it').output.payload;
                    error.attributes = preexcel.errors;
                    return res.json(error);
                }
            });
        } else {
            res.status(404);
            res.json(boom.notFound('preexcel not found').output.payload);
        }
    });
}

router.put('/:preexcel_id', update);

/**
* Create action, creates a single preexcel
* Default mapping to POST '~/preexcels', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function create(req, res) {
    var PreExcel = caminte.model('PreExcel');
    var preexcel = new PreExcel(req.body);
    preexcel.isValid(function (isValid) {
        if (!isValid) {
           res.status(422);
           var error = boom.badData('data is bad you should fix it').output.payload;
           error.attributes = preexcel.errors;
           return res.json(error);
        }
        preexcel.save(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            }
            res.status(201);
            res.json(preexcel.toObject());
        });
   });
}

router.post('/', create);

/**
* Delete action, deletes a single preexcel
* Default mapping to DEL '~/preexcels/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function destroy(req, res) {
    var PreExcel = caminte.model('PreExcel');
    PreExcel.findById(req.params.preexcel_id, function (err, preexcel) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (!preexcel) {
            res.status(404);
            return res.json(boom.notFound('preexcel not found').output.payload);
        }
        preexcel.destroy(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            } else {
               res.status(204);
               res.json({
                  message: 'preexcels deleted!'
               });
            }
        });
    });
}

router.delete('/:preexcel_id', destroy);

/**
* Delete action, deletes a all preexcels
* Default mapping to DEL '~/preexcels', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function truncate(req, res) {
    var PreExcel = caminte.model('PreExcel');
    PreExcel.destroyAll(function (err) {
        if (err) {
          res.status(400);
          return res.json(boom.badRequest(err.message || err).output.payload);
        } else {
          res.status(204);
          res.json({
            statusCode: 204,
            message: 'All preexcels deleted'
          });
        }
    });
}

router.delete('/truncate', truncate);

module.exports = router;
