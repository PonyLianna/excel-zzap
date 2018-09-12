/**
 *  Excel Routes
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
router.param('excel_id', function (req, res, next, excel_id) {
   if (/^\d+$/.test(excel_id)) {
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
* Default mapping to GET '~/excels'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function list(req, res) {
    var Excel = caminte.model('Excel');
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

    Excel.all(opts, function (err, excels) {
        if (err) {
           res.status(400);
           return res.json(boom.badRequest(err.message || err).output.payload);
        }
        res.status(200);
        res.json(excels);
    });
};

router.get('/', list);

/**
 * Count items action, returns amount of excel
 * Default mapping to GET '~/excels/count'
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 **/
function count(req, res) {
    var Excel = caminte.model('Excel');
    var query = req.query;

    var opts = {
        where: {}
    };

    // TODO: it needs implementation
    _.extend(opts.where, query);

    Excel.count(opts.where, function (err, count) {
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
* New action, returns new a single excel
* Default mapping to GET '~/excels/new'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function empty(req, res) {
    var Excel = caminte.model('Excel');
    var excel = new Excel(req.query);
    res.status(200);
    res.json(excel.toObject());
}

router.get('/new', empty);

/**
* Show action, returns shows a single excel
* Default mapping to GET '~/excels/:id'
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function show(req, res) {
    var Excel = caminte.model('Excel');
    Excel.findById(req.params.excel_id, function (err, excel) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (excel) {
            res.status(200);
            res.json(excel.toObject());
        } else {
            res.status(404);
            res.json(boom.notFound('excel not found').output.payload);
        }
    });
}

router.get('/:excel_id', show);

/**
* Update action, updates a single excel
* Default mapping to PUT '~/excels/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function update(req, res) {
    var query = req.body;
    var Excel = caminte.model('Excel');
    Excel.findById(req.params.excel_id, function (err, excel) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (excel) {

            _.extend(excel, query);

            excel.isValid(function (isValid) {
                if(isValid) {
                    excel.updateAttributes(req.body, function (err) {
                        if (err) {
                            res.status(400);
                            return res.json(boom.badRequest(err.message || err).output.payload);
                        }
                        res.status(200);
                        res.json(excel.toObject());
                    });
                } else {
                    res.status(422);
                    var error = boom.badData('data is bad you should fix it').output.payload;
                    error.attributes = excel.errors;
                    return res.json(error);
                }
            });
        } else {
            res.status(404);
            res.json(boom.notFound('excel not found').output.payload);
        }
    });
}

router.put('/:excel_id', update);

/**
* Create action, creates a single excel
* Default mapping to POST '~/excels', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function create(req, res) {
    var Excel = caminte.model('Excel');
    var excel = new Excel(req.body);
    excel.isValid(function (isValid) {
        if (!isValid) {
           res.status(422);
           var error = boom.badData('data is bad you should fix it').output.payload;
           error.attributes = excel.errors;
           return res.json(error);
        }
        excel.save(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            }
            res.status(201);
            res.json(excel.toObject());
        });
   });
}

router.post('/', create);

/**
* Delete action, deletes a single excel
* Default mapping to DEL '~/excels/:id', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function destroy(req, res) {
    var Excel = caminte.model('Excel');
    Excel.findById(req.params.excel_id, function (err, excel) {
        if (err) {
            res.status(400);
            return res.json(boom.badRequest(err.message || err).output.payload);
        }
        if (!excel) {
            res.status(404);
            return res.json(boom.notFound('excel not found').output.payload);
        }
        excel.destroy(function (err) {
            if (err) {
               res.status(400);
               return res.json(boom.badRequest(err.message || err).output.payload);
            } else {
               res.status(204);
               res.json({
                  message: 'excels deleted!'
               });
            }
        });
    });
}

router.delete('/:excel_id', destroy);

/**
* Delete action, deletes a all excels
* Default mapping to DEL '~/excels', no GET mapping
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
**/
function truncate(req, res) {
    var Excel = caminte.model('Excel');
    Excel.destroyAll(function (err) {
        if (err) {
          res.status(400);
          return res.json(boom.badRequest(err.message || err).output.payload);
        } else {
          res.status(204);
          res.json({
            statusCode: 204,
            message: 'All excels deleted'
          });
        }
    });
}

router.delete('/truncate', truncate);

module.exports = router;
