const mysql = require('./../middlewares/database/init');

products = mysql.db_csv("null.csv", "excel");
