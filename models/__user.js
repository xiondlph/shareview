/**
 * Модель данных пользователя
 *
 * @module      Model.__User
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import Nedb from 'nedb';
import db from '../db';

const
    // Локальное хранилище пользователей
    store = new Nedb({ filename: `${process.env.APPPATH}/store/__users.json`, autoload: true }),

    nedbInsert = (user, mongoResult) => {
        return new Promise((resolve, reject) => {
            user._id = mongoResult.insertedId.toString();
            store.insert(user, (err, nedbResult) => {
                if (err) {
                    reject(err);
                    return;
                }

                store.loadDatabase();
                resolve({
                    mongoResult,
                    nedbResult,
                });
            });
        });
    },

    nedbUpdate = (query, data, mongoResult) => {
        return new Promise((resolve, reject) => {
            if (query._id) {
                query._id = query._id.toString();
            }

            store.update(query, data, (err, nedbResult) => {
                if (err) {
                    reject(err);
                    return;
                }

                store.loadDatabase();
                resolve({
                    mongoResult,
                    nedbResult,
                });
            });
        });
    },

    mongoUpdate = (query, data) => {
        return db.collection('users')
            .updateOne(query, data)
            .then(mongoResult => { return nedbUpdate(query, data, mongoResult); });
    },
    /**
     * Экспорт методов модели данных системы безопастности
     *
     * @method __User
     * @param {Object} req - Объект запроса сервера
     * @param {Object} res - Объект ответа сервера
     * @param {Function} next - Следующий слой обработки запроса
     */
    __user = (req, res, next) => {
        // Инициализация объекта модели
        req.model = req.model || {};

        /**
         * Объект модели данных
         * интегрированный в объект запроса
         *
         * @attribute model.user
         * @type Object
         */
        req.model.__user = {
            /**
             * Получения пользователя по индексу сессии
             *
             * @method getUserBySession
             * @param {String} sid
             * @return {Promise}
             */
            getUserBySession(sid) {
                return db.collection('users')
                    .find({ sid })
                    .limit(1)
                    .toArray()
                    .then(users => { return users.length ? users[0] : null; });
            },

            /**
             * Получения пользователя по Email
             *
             * @method getUserByEmail
             * @param {String} email
             * @return {Promise}
             */
            getUserByEmail(email) {
                return db.collection('users')
                    .find({ email })
                    .limit(1)
                    .toArray()
                    .then(users => { return users.length ? users[0] : null; });
            },

            /**
             * Создание нового пользователя
             *
             * @method create
             * @param {Object} user
             * @return {Promise}
             */
            create(user) {
                return db.collection('users')
                    .insertOne(user)
                    .then(mongoResult => { return nedbInsert(user, mongoResult); });
            },

            /**
             * Установка хеша текущей сессии для пользователя по id
             *
             * @method setSessionById
             * @param {Number} id
             * @param {String} sid
             */
            setSessionById(id, sid) {
                return mongoUpdate({ _id: id }, { $set: { sid } });
            },

            /**
             * Удаление хеша текущей сессии для пользователя по id
             *
             * @method unsetSessionById
             * @param {Number} id
             */
            unsetSessionById(id) {
                return mongoUpdate({ _id: id }, { $unset: { sid: true } });
            },

            /**
             * Установка нового пароля для пользователя по Email
             *
             * @method setPasswordByEmail
             * @param {String} email
             * @param {String} password
             */
            setPasswordByEmail(email, password) {
                return mongoUpdate({ email }, { $set: { password } });
            },

            /**
             * Обновление данных пользователя
             *
             * @method update
             * @param {Number} id
             * @param {Object} data
             */
            update(id, data) {
                return mongoUpdate({ _id: id }, { $set: data });
            },
        };

        next();
    };

export default __user;
