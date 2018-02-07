var xlsx = require('xlsx');

exports.read = function(time){
     console.log(time);
     excel = xlsx.readFile("./uploads/test.xlsx");
     console.log("Reading is successful");

     var sheet_name_list = workbook.SheetNames; // все имена воркбуков
     sheet_name_list.forEach(function(y) { // для каждого из воркбуков y = workbook
         var worksheet = workbook.Sheets[y]; // читаем один воркбук
         var headers = {}; // header'ы
         var data = []; // массив, в который будем записывать
         for (z in worksheet) {

         }
//         for(z in worksheet) { // для ячейки в одном воркбуке
//            if(z[0] === '!') continue; // если есть функция
//            var tt = 0; //
//            for (var i = 0; i < z.length; i++) {
//                if (!isNaN(z[i])) { // если не пустой, то
//                    tt = i; // записываем значение в tt
//                    break;
//                }
//            };
//            var col = z.substring(0,tt);
//            var row = parseInt(z.substring(tt));
//            var value = worksheet[z].v;
//
//            if(!data[row]) data[row]={};
//            data[row][headers[col]] = value;
//          }
//        data.shift();
//        console.log(data);
      });
};