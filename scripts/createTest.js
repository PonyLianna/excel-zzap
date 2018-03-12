const mysql = require('./../middlewares/database/init');

mysql.createUser('admin', 'admin', '1');
mysql.createUser('user', 'user');