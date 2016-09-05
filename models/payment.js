/**
 * Модель данных системы платежей
 *
 * @module      Model.Payment
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import db from '../db';
import { ObjectID } from '../db';

const
    /**
     * Экспорт методов модели данных системы безопастности
     *
     * @method payment
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    __payment = (req, res, next) => {
        // Инициализация объекта модели
        req.model = req.model || {};

        // Интеграция ObjectID
        req.model.ObjectID = ObjectID;

        /**
         * Объект модели данных
         * интегрированный в объект запроса
         *
         * @attribute model.payment
         * @type Object
         */
        req.model.__payment = {
            /**
             * Добавление нового уведомления
             *
             * @method add
             * @param {Object} data
             */
            add(data) {
                return db.collection('payments')
                    .insertOne(data);
            },

            /**
             * Получение списка уведомлений пользователя по email
             *
             * @method listById
             * @param email
             * @param skip
             * @param limit
             */
            listById(email, skip = 0, limit = 0) {
                const collection = db.collection('users');

                return collection
                    .find({ label: email }, { sort: { _id: -1 } })
                    .count()
                    .then(count => {
                        return collection.find(
                            {
                                label: email,
                            },
                            {
                                fields: {
                                    datetime: 1,
                                    withdraw_amount: 1,
                                    _lastPeriod: 1,
                                    _newPeriod: 1,
                                },
                                sort:
                                {
                                    _id: -1,
                                },
                                skip,
                                limit,
                            })
                            .toArray()
                            .then(payments => {
                                return {
                                    payments,
                                    count,
                                };
                            });
                    });
            },
        };

        next();
    };

export default __payment;
