exports.config = {
    host: 'localhost',
    user: 'root',
    password: ''
};

exports.db = 'my_db'; // database name

pool_config = exports.config;
pool_config.connectionLimit = 500;
pool_config.database = exports.db;

exports.pool_config = pool_config;