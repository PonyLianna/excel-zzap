const mysql = require('./../middlewares/database/init');

products = mysql.db_csv("test2.csv");
