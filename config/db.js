exports.config = {
    host: 'localhost',
    user: 'root',
    password: ''
};

pool_config = exports.config;
pool_config.connectionLimit = 400;
pool_config.database = 'my_db';

exports.pool_config = pool_config;