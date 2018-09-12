/**
 *  Times Routes
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
router.param('time_id', function (req, res, next, time_id) {
   if (/^\d+$/.test(time_id)) {
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
* Default mapping to GET '~/times'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function list(req, res) {
    var Times = caminte.model('Times');
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

    Times.all(opts, function (err, times) {
        if (err) {
           res.status(400);
           return res.json(boom.badRequest(err.message || err).output.payload);
        }
        res.status(200);
        res.json(times);
    });
};

router.get('/', list);

/**
 * Count items action, returns amount of time
 * Default mapping to GET '~/times/count'
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 **/
function count(req, res) {
    var Times = caminte.model('Times');
    var query = req.query;

    var opts = {
        where: {}
    };

    // TODO: it needs implementation
    _.extend(opts.where, query);

    Times.count(opts.where, function (err, count) {
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
* New action, returns new a single time
* Default mapping to GET '~/times/new'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function empty(req, res) {
    var Times = caminte.model('Times');
    var time = new Times(req.query);
    res.status(200);
    res.json(time.toObject());
}

router.get('/new', empty);

/**
* Show action, returns shows a single time
* Default mapping to GET '~/times/:id'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function show(req, res) {
    var Times = caminte.model('Times');
    Times.findById(req.params.time_id, function (err, time) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (time) {
            res.status(200);
            res.json(time.toObject());
        } else {
            res.status(404);
            res.json(boom.notFound('time not found').output.payload);
        }
    });
}

router.get('/:time_id', show);

/**
* Update action, updates a single time
* Default mapping to PUT '~/times/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function update(req, res) {
    var query = req.body;
    var Times = caminte.model('Times');
    Times.findById(req.params.time_id, function (err, time) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (time) {

            _.extend(time, query);

            time.isValid(function (isValid) {
                if(isValid) {
                    time.updateAttributes(req.body, function (err) {
                        if (err) {
                            res.status(400);
                            return res.json(boom.badRequest(err.message || err).output.payload);
                        }
                        res.status(200);
                        res.json(time.toObject());
                    });
                } else {
                    res.status(422);
                    var error = boom.badData('data is bad you should fix it').output.payload;
                    error.attributes = time.errors;
                    return res.json(error);
                }
            });
        } else {
            res.status(404);
            res.json(boom.notFound('time not found').output.payload);
        }
    });
}

router.put('/:time_id', update);

/**
* Create action, creates a single time
* Default mapping to POST '~/times', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function create(req, res) {
    var Times = caminte.model('Times');
    var time = new Times(req.body);
    time.isValid(function (isValid) {
        if (!isValid) {
           res.status(422);
           var error = boom.badData('data is bad you should fix it').output.payload;
           error.attributes = time.errors;
           return res.json(error);
        }
        time.save(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            }
            res.status(201);
            res.json(time.toObject());
        });
   });
}

router.post('/', create);

/**
* Delete action, deletes a single time
* Default mapping to DEL '~/times/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function destroy(req, res) {
    var Times = caminte.model('Times');
    Times.findById(req.params.time_id, function (err, time) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (!time) {
            res.status(404);
            return res.json(boom.notFound('time not found').output.payload);
        }
        time.destroy(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            } else {
               res.status(204);
               res.json({
                  message: 'times deleted!'
               });
            }
        });
    });
}

router.delete('/:time_id', destroy);

/**
* Delete action, deletes a all times
* Default mapping to DEL '~/times', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function truncate(req, res) {
    var Times = caminte.model('Times');
    Times.destroyAll(function (err) {
        if (err) {
          res.status(400);
          return res.json(boom.badRequest(err.message || err).output.payload);
        } else {
          res.status(204);
          res.json({
            statusCode: 204,
            message: 'All times deleted'
          });
        }
    });
}

router.delete('/truncate', truncate);

module.exports = router;
