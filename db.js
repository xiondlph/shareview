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
import mongodb from 'mongodb';

const
    logDB = debug('shareview:mongodb'),
    Server = mongodb.Server,
    Db = mongodb.Db,
    ObjectID = mongodb.ObjectID,
    mongoAuth = +process.env.DB_AUTH,
    mongoHost = process.env.DB_HOST || 'ds040888.mlab.com',
    mongoPort = process.env.DB_PORT || 40888,

    // Объект БД
    db = new Db('shareview', new Server(mongoHost, mongoPort), { safe: true }),

    /**
     * Инициализация базы данных (соединение, авторизация)
     *
     * @method init
     * @return {Object} db
     */
    init = new Promise((resolve) => {
        // Соединение с БД
        /* eslint no-shadow: ["error", { "allow": ["db", "err"] }] */
        db.open((err, db) => {
            if (err) {
                throw new Error(`Mongo error - ${err.message}`);
            }

            logDB('DB opened');
            // Авторизация
            if (mongoAuth) {
                db.authenticate('shareview', 'XtFyKBXeChHY', (err) => {
                    if (err) {
                        throw new Error(`Mongo error - ${err.message}`);
                    }

                    logDB('DB authenticated');
                    resolve(db);
                });
            } else {
                resolve(db);
            }
        });
    });


/**
 * Експорт объекта базы данных
 *
 * @attribute db
 * @type Object
 */
export { db };

/**
 * Експорт метода инициализации
 *
 * @attribute init
 * @type Function
 */
export { init };

/**
 * Експорт объекта ObjectID
 *
 * @attribute ObjectID
 * @type Object
 */
export { ObjectID };
