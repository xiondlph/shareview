/**
 * Адаптер Базы данных MongoDB
 *
 * @module      Db
 * @class       Db
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


// Объявление модулей
var debug               = require('debug')('express:shareview:mongodb'),
    mongo               = require('mongodb'),
    Server              = mongo.Server,
    ReplSet             = mongo.ReplSet,
    Db                  = mongo.Db,
    BSON                = mongo.BSONPure,

    // Объект БД
    db = new Db('shareview', new Server('ds059712.mlab.com', 59712), {safe: true});


/**
 * Инициализация базы данных (соединение, авторизация)
 *
 * @method init
 * @return {Object} db
 */
exports.init = function () {

    // Соединение с БД
    db.open(function (err, db) {
        if (err) {
            throw new Error('Mongo error - ' + err.message);
        }

        debug('DB opened');
        // Авторизация
        db.authenticate('shareview', 'hwnd_des83', function (err, result) {
            if (err) {
                throw new Error('Mongo error - ' + err.message);
            }

            debug('DB authenticated');
        });
    });

    return db;
};


/**
 * Експорт объекта базы данных
 *
 * @attribute bson
 * @type Object
 */
exports.db = db;


/**
 * Експорт объекта bson
 *
 * @attribute bson
 * @type Object
 */
exports.bson = BSON;
