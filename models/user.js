/**
 * Модель данных пользователя
 *
 * @module      Model.User
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import { db } from '../db';

const
    mongoUpdate = (query, data) => {
        return db.collection('users')
            .updateOne(query, data);
    },

    /**
     * Экспорт методов модели данных системы безопастности
     *
     * @method user
     * @param {Object} req - Объект запроса сервера
     * @param {Object} res - Объект ответа сервера
     * @param {Function} next - Следующий слой обработки запроса
     */
    user = (req, res, next) => {
        // Инициализация объекта модели
        req.model = req.model || {};

        /**
         * Объект модели данных
         * интегрированный в объект запроса
         *
         * @attribute model.user
         * @type Object
         */
        req.model.user = {
            /**
             * Получения пользователя по id
             *
             * @method getUserById
             * @param {Object} _id
             */
            getUserById(_id) {
                return db.collection('users')
                    .find({ _id })
                    .limit(1)
                    .toArray()
                    .then(users => { return users.length ? users[0] : null; });
            },

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
             * @param {Object} data данные нового пользователя
             * @return {Promise}
             */
            create(data) {
                return db.collection('users')
                    .insertOne(data);
            },

            /**
             * Установка хеша текущей сессии для пользователя по id
             *
             * @method setSessionById
             * @param {Object} _id
             * @param {String} sid
             */
            setSessionById(_id, sid) {
                return mongoUpdate({ _id }, { $set: { sid } });
            },

            /**
             * Удаление хеша текущей сессии для пользователя по id
             *
             * @method unsetSessionById
             * @param {Object} _id
             */
            unsetSessionById(_id) {
                return mongoUpdate({ _id }, { $unset: { sid: true } });
            },

            /**
             * Установка нового пароля для пользователя по id
             *
             * @method setPasswordId
             * @param {Object} _id
             * @param {String} password
             */
            setPasswordId(_id, password) {
                return mongoUpdate({ _id }, { $set: { password } });
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
             * @param {Object} _id
             * @param {Object} data
             */
            update(_id, data) {
                return mongoUpdate({ _id }, { $set: data });
            },
        };

        next();
    };

export default user;
