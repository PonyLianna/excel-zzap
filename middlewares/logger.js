const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf} = format;

exports.main = function () {
    return createLogger({
        format: combine(
            timestamp(),
            printf(info => {
                return `${new Date(info.timestamp).toLocaleString('en-US', 
                    {timeZone: 'UTC'})} ${info.level}: ${info.message}`;

            })
        ),
        transports: [
            // new transports.Console(),
            new transports.File({
                filename: 'logs/logs-1.log',
                handleExceptions: true,
                maxsize: 10485760, //10MB
                maxFiles: 1,
            })
        ]
    });
};