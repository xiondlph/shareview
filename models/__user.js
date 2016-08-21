/**
 * Модель данных пользователя
 *
 * @module      Model.__User
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import db from '../db';

const
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
                return db.collection('users').find({ sid }).limit(1).toArray();
            },

            /**
             * Получения пользователя по Email
             *
             * @method getUserByEmail
             * @param {String} email
             * @return {Promise}
             */
            getUserByEmail(email) {
                return db.collection('users').find({ email }).limit(1).toArray();
            },

            /**
             * Создание нового пользователя
             *
             * @method create
             * @param {Object} user
             * @return {Promise}
             */
            create(user) {
                return db.collection('users').insertOne(user);
            },
        };

        next();
    };

export default __user;
