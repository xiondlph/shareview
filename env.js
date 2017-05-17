/**
 * Модуль пременные окружения
 *
 * @module      Env
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

module.exports = {
    NODE_ENV: 'prodaction',
    PORT: 3001,
    APPPATH: __dirname,
    JWT_SECRET: 'shareview',
    DB_HOST: 'ds040888.mlab.com',
    DB_PORT: 40888,
    DB_AUTH: 1,
    DEBUG: [
        'shareview:cluster',
        'shareview:server',
        'shareview:mongodb',
    ],
};
