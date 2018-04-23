const config = require('./config');

exports.config = config.dbconfig;

exports.db = config.dbname; // database name

pool_config = exports.config;
pool_config.connectionLimit = 500;
pool_config.database = exports.db;

exports.pool_config = pool_config;