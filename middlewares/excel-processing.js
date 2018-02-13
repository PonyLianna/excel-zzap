var xlsx = require('xlsx');

exports.read = function (time) {
    console.log(time);
    excel = xlsx.readFile("./uploads/test.xlsx");
    console.log("Reading is successful");
    var sheet_name_list = excel.SheetNames;
    sheet = xlsx.utils.sheet_to_json(excel.Sheets[sheet_name_list[0]])
    for (var i in sheet) {
        console.log(sheet[i]["Производитель"] + " " + sheet[i]["Артикул"]
            + " " + sheet[i]["Цена"] + " " + sheet[i]["Количество"]);
    }
};