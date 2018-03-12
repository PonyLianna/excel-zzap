const mysql = require('./../middlewares/database/init');

mysql.destroy(mytable = 'users');