/**
 * Главный модуль сервера
 *
 * @module      Server
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


// Объявление модулей
var express     = require('express'),
    vhost       = require('vhost'),
    debug       = require('debug')('express:shareview:server'),
    exception   = require('./exception'),

    // Набор хостов
    baseHost    = require('./hosts/base'),

    app         = express(),

    /**
     * @config host
     * @type String
     */
    host;

if (process.env.NODE_ENV !== 'prod') {
    host = process.env.HOST || 'dev.shareview';
    debug('host:%s', host);
} else {
    host = process.env.HOST || 'shareview';
}

// Подкдючение хостов
app.use(vhost('www.' + host + '.ru', baseHost.app));

/**
 * Метод запуска сервера
 *
 * @method start
 */
exports.start = function () {
    var port = process.env.PORT || 4000;

    // Запуск web сервера на порту 3000/4000
    app.listen(port,  function () {
        debug('Listening on port ' + port);
    });
};