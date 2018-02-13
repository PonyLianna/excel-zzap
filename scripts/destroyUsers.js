const mysql = require('./../middlewares/database');

mysql.destroy(mytable = "users");