const nodemailer = require('nodemailer');
const smtpConfig = require('../config/email').config;

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

async function send (email, subject, text, path) {
    let message = {
        from: "jokki.kolli@yandex.ru",
        to: email,
        subject: subject,
        text: text,
        attachments: [{
            path: path
        }]
    };

    const transporter = await nodemailer.createTransport(smtpConfig);
    transporter.sendMail(message, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendMail = async function(emailList, subject, text, path){
    await asyncForEach(emailList.split(','), async function (email) {
        await send(email, subject, text, path);
        console.log(email);
    });
    console.log('Email ended!');
};

exports.getEmails = function () {

};