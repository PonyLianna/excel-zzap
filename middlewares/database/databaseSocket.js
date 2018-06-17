const mysql = require('mysql');
const pool = require('./database').pool;
const queryFunction = require('./database').queryFunction;

exports.addData = function (time) {
    console.log(time);
    queryFunction('INSERT INTO times (time) VALUES (?)', time);
};

exports.delData = function (time) {
    queryFunction("DELETE FROM times WHERE time = '" + time + "'");
};

exports.readData = async function () {
    return await queryFunction('SELECT * FROM times');
};

exports.findData = async function (time) {
    return await queryFunction("SELECT * FROM times where time = '" + time + "'");
};