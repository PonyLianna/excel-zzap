const postman = require('../middlewares/postman');

function date() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const day = currentDate.getDay();
    const month = currentDate.getMonth();
    const hour = currentDate.getHours();
    const min  = currentDate.getMinutes();
    return year + ":" + month + ":" + day + ":" + hour + ":" + min;
}

postman.sendMail("knocker767@gmail.com", date(), '', __dirname + '/../final/finalwithsellers1.xlsx');