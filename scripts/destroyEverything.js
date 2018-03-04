const mysql = require('./../middlewares/database');

mysql.destroy(mytable = 'excel');
mysql.destroy(mytable = 'users');
mysql.destroy(mytable = 'sellers');
mysql.destroy(mytable = 'empty');
mysql.destroy(mytable = 'temp');