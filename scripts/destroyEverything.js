const mysql = require('./../middlewares/database/init');

mysql.destroy(mytable = 'excel');
mysql.destroy(mytable = 'users');
mysql.destroy(mytable = 'sellers');
mysql.destroy(mytable = 'empty');
mysql.destroy(mytable = 'temp');