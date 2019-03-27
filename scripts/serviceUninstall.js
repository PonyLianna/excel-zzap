const Service = require('node-windows').Service;

global.logger = require('../middlewares/logger').main();

let svc = new Service({
    name: 'excel-zzap',
    description: 'excel-zzap webserver.',
    script: `${__dirname}/start.js`
});

svc.on('error', (err) => {
    logger.error(err);
});

svc.on('invalidinstallation', (err) => {
    logger.error(err);
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
    logger.info('Uninstall complete.');
    logger.info('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();
