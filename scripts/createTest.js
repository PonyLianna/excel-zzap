const mysql = require('./../middlewares/database');
mysql.createUser(name = 'admin', password = 'admin', admin = '1');
mysql.createUser(name = 'user', password = 'user');