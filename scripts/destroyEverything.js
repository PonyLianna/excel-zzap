const mysql = require('./../middlewares/database/init');
return Promise.all([
    mysql.destroy(mytable = 'excel'),
    mysql.destroy(mytable = 'pre_excel'),
    mysql.destroy(mytable = 'temp_excel'),

    mysql.destroy(mytable = 'users'),
    mysql.destroy(mytable = 'sessions'),

    mysql.destroy(mytable = 'sellers'),
    mysql.destroy(mytable = 'pre_sellers'),

    mysql.destroy(mytable = 'empty'),
    mysql.destroy(mytable = 'pre_empty'),

    mysql.destroy(mytable = 'temp'),
    mysql.destroy(mytable = 'times')
]);

console.log('destroy');