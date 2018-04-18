const init = require('./init');

exports.destroyAll = async function () {
    return await Promise.all([
        init.destroy('excel'),
        init.destroy('pre_excel'),
        init.destroy('temp_excel'),

        init.destroy('users'),

        init.destroy('sellers'),
        init.destroy('pre_sellers'),

        init.destroy('empty'),
        init.destroy('pre_empty'),
        init.destroy('temp'),
        init.destroy('times')
    ]);

};

exports.createAll = async function () {
    return await init.configure();
};

exports.csv = async function () {
    return await init.db_csv("null.csv", "excel");
};

exports.createUsers = async function () {
    await init.createUser('admin', 'admin', '1');
    await init.createUser('user', 'user');
};
