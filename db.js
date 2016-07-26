/**
 * Адаптер Базы данных MongoDB
 *
 * @module      Db
 * @class       Db
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


// Объявление модулей
import debug from 'debug';
import mongo from 'mongodb';

const
    logDB               = debug('shareview:mongodb'),
    Server              = mongo.Server,
    ReplSet             = mongo.ReplSet,
    Db                  = mongo.Db,
    BSON                = mongo.BSONPure,
    isDev               = process.env.NODE_ENV === 'development',
    mongoHost           = isDev && 'localhost' || 'ds040888.mlab.com',
    mongoPort           = isDev && 27017 || 40888,

    // Объект БД
    db = new Db('shareview', new Server(mongoHost, mongoPort), {safe: true});

/**
 * Инициализация базы данных (соединение, авторизация)
 *
 * @method init
 * @return {Object} db
 */
let init = () => {
    return new Promise((resolve) => {
        // Соединение с БД
        db.open((err, db) => {
            if (err) {
                throw new Error('Mongo error - ' + err.message);
            }

            logDB('DB opened');
            // Авторизация
            !isDev && db.authenticate('shareview', 'XtFyKBXeChHY', (err, result) => {
                if (err) {
                    throw new Error('Mongo error - ' + err.message);
                }

                logDB('DB authenticated');
                resolve(db);
            }) || resolve(db);
        });
    });
};


/**
 * Експорт объекта базы данных
 *
 * @attribute db
 * @type Object
 */
export default db;


/**
 * Експорт метода инициализации
 *
 * @attribute init
 * @type Function
 */
export {init};

/**
 * Експорт объекта bson
 *
 * @attribute bson
 * @type Object
 */
export {BSON as bson};