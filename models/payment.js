/**
 * Модель данных системы платежей
 *
 * @module      Model.Payment
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import { db, ObjectID } from '../db';

const
    /**
     * Экспорт методов модели данных системы безопастности
     *
     * @method payment
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    payment = (req, res, next) => {
        // Инициализация объекта модели
        if (!req.model) {
            req.model = {};
        }

        // Интеграция ObjectID
        req.model.ObjectID = ObjectID;

        /**
         * Объект модели данных
         * интегрированный в объект запроса
         *
         * @attribute model.payment
         * @type Object
         */
        req.model.payment = {


            /**
             * Добавление нового уведомления
             *
             * @method add
             * @param {Object} data
             * @param {Function} accept
             */
            add(data, accept) {
                db.collection('payments', (err, collection) => {
                    if (err) {
                        throw new Error(`Mongo error - ${err.message}`);
                    }

                    collection.insert(data, (err, payment) => {
                        if (err) {
                            throw new Error(`Mongo error - ${err.message}`);
                        }

                        if (typeof accept === 'function') {
                            accept(payment);
                        }
                    });
                });
            },


            /**
             * Получение списка уведомлений пользователя по email
             *
             * @method listByEmail
             * @param {Function} accept
             * @param email
             * @param skip
             * @param limit
             */
            listByEmail(email, skip = 0, limit = 0, accept) {
                db.collection('payments', (err, collection) => {
                    if (err) {
                        accept(new Error(`Mongo error - ${err.message}`));
                        return;
                    }

                    collection.find({ label: email }, { sort: { _id: -1 } }).count((err, count) => {
                        if (err) {
                            accept(new Error(`Mongo error - ${err.message}`));
                            return;
                        }

                        collection.find(
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
                            }).toArray((err, payments) => {
                                if (err) {
                                    accept(new Error(`Mongo error - ${err.message}`));
                                    return;
                                }

                                if (typeof accept === 'function') {
                                    accept(null, payments, count);
                                }
                            });
                    });
                });
            },
        };

        next();
    };

export default payment;
