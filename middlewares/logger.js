const winston = require('winston');
const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf} = format;

exports.main = function () {
    return createLogger({
        format: combine(
            // label({label: filename}),
            timestamp(),
            printf(info => {
                // let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                // return `${new Date(info.timestamp).toLocaleString('en-US', {timeZone: 'UTC'})}
                // [${info.label}] ${info.level}: ${info.message}`;
                return `${new Date(info.timestamp).toLocaleString('en-US', 
                    {timeZone: 'UTC'})} ${info.level}: ${info.message}`;

            })
        ),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: 'logs/combined.log',
                handleExceptions: true,
                maxsize: 5242880, //5MB
                maxFiles: 5,
            })
        ]
    });
};