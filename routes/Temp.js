/**
 *  Temp Routes
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
router.param('temp_id', function (req, res, next, temp_id) {
   if (/^\d+$/.test(temp_id)) {
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
* Default mapping to GET '~/temps'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function list(req, res) {
    var Temp = caminte.model('Temp');
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

    Temp.all(opts, function (err, temps) {
        if (err) {
           res.status(400);
           return res.json(boom.badRequest(err.message || err).output.payload);
        }
        res.status(200);
        res.json(temps);
    });
};

router.get('/', list);

/**
 * Count items action, returns amount of temp
 * Default mapping to GET '~/temps/count'
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 **/
function count(req, res) {
    var Temp = caminte.model('Temp');
    var query = req.query;

    var opts = {
        where: {}
    };

    // TODO: it needs implementation
    _.extend(opts.where, query);

    Temp.count(opts.where, function (err, count) {
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
* New action, returns new a single temp
* Default mapping to GET '~/temps/new'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function empty(req, res) {
    var Temp = caminte.model('Temp');
    var temp = new Temp(req.query);
    res.status(200);
    res.json(temp.toObject());
}

router.get('/new', empty);

/**
* Show action, returns shows a single temp
* Default mapping to GET '~/temps/:id'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function show(req, res) {
    var Temp = caminte.model('Temp');
    Temp.findById(req.params.temp_id, function (err, temp) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (temp) {
            res.status(200);
            res.json(temp.toObject());
        } else {
            res.status(404);
            res.json(boom.notFound('temp not found').output.payload);
        }
    });
}

router.get('/:temp_id', show);

/**
* Update action, updates a single temp
* Default mapping to PUT '~/temps/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function update(req, res) {
    var query = req.body;
    var Temp = caminte.model('Temp');
    Temp.findById(req.params.temp_id, function (err, temp) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (temp) {

            _.extend(temp, query);

            temp.isValid(function (isValid) {
                if(isValid) {
                    temp.updateAttributes(req.body, function (err) {
                        if (err) {
                            res.status(400);
                            return res.json(boom.badRequest(err.message || err).output.payload);
                        }
                        res.status(200);
                        res.json(temp.toObject());
                    });
                } else {
                    res.status(422);
                    var error = boom.badData('data is bad you should fix it').output.payload;
                    error.attributes = temp.errors;
                    return res.json(error);
                }
            });
        } else {
            res.status(404);
            res.json(boom.notFound('temp not found').output.payload);
        }
    });
}

router.put('/:temp_id', update);

/**
* Create action, creates a single temp
* Default mapping to POST '~/temps', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function create(req, res) {
    var Temp = caminte.model('Temp');
    var temp = new Temp(req.body);
    temp.isValid(function (isValid) {
        if (!isValid) {
           res.status(422);
           var error = boom.badData('data is bad you should fix it').output.payload;
           error.attributes = temp.errors;
           return res.json(error);
        }
        temp.save(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            }
            res.status(201);
            res.json(temp.toObject());
        });
   });
}

router.post('/', create);

/**
* Delete action, deletes a single temp
* Default mapping to DEL '~/temps/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function destroy(req, res) {
    var Temp = caminte.model('Temp');
    Temp.findById(req.params.temp_id, function (err, temp) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (!temp) {
            res.status(404);
            return res.json(boom.notFound('temp not found').output.payload);
        }
        temp.destroy(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            } else {
               res.status(204);
               res.json({
                  message: 'temps deleted!'
               });
            }
        });
    });
}

router.delete('/:temp_id', destroy);

/**
* Delete action, deletes a all temps
* Default mapping to DEL '~/temps', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function truncate(req, res) {
    var Temp = caminte.model('Temp');
    Temp.destroyAll(function (err) {
        if (err) {
          res.status(400);
          return res.json(boom.badRequest(err.message || err).output.payload);
        } else {
          res.status(204);
          res.json({
            statusCode: 204,
            message: 'All temps deleted'
          });
        }
    });
}

router.delete('/truncate', truncate);

module.exports = router;
