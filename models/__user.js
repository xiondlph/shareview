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
             * Получения пользователя по Email
             *
             * @method getUserByEmail
             * @param {String} email
             * @param {Function} accept
             */
            getUserByEmail(email) {
                return db.collection('users').find({ email }).limit(1).toArray();
            },
        };

        next();
    };

export default __user;
