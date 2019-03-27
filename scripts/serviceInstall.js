const Service = require('node-windows').Service;

global.logger = require('../middlewares/logger').main();

let svc = new Service({
    name: 'excel-zzap',
    description: 'excel-zzap webserver.',
    script: `${__dirname}/start.js`
});

svc.on('install', () => {
    svc.start();
    logger.info('Служба запущена');
});

svc.on('stop', () => {
    logger.info('Служба остановлена');
});

svc.on('alreadyinstalled', () => {
    logger.info('Служба уже установлена');
});

svc.on('error', (err) => {
    logger.error(err);
});

svc.on('invalidinstallation', (err)=>{
    logger.error(err);
});

svc.install();