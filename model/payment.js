/**
 * Модель данных системы платежей
 *
 * @module      Model.Payment
 * @class       Model.Payment
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


// Объявление модулей
var mongo = require('../db');


/**
 * Экспорт методов модели данных системы безопастности
 *
 * @method payment
 * @param {Object} req Объект запроса сервера
 * @param {Object} res Объект ответа сервера
 * @param {Function} next
 */
module.exports = function (req, res, next) {


    // Инициализация объекта модели
    if (!req.hasOwnProperty('model')) {
        req.model = {};
    }

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
        add: function (data, accept) {
            mongo.db.collection('payments', function (err, collection) {
                if (err) {
                    throw new Error('Mongo error - ' + err.message);
                }

                collection.insert(data, function (err, payment) {
                    if (err) {
                        throw new Error('Mongo error - ' + err.message);
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
         * @param {Object} data
         * @param {Function} accept
         */
        listByEmail: function (email, skip, limit, accept) {
            skip  = skip  || 0;
            limit = limit || 0;

            mongo.db.collection('payments', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.find({label: email}, {sort: {_id: -1}}).count(function (err, count) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    collection.find({label: email}, {fields: {'datetime': 1, 'withdraw_amount': 1, '_lastPeriod': 1, '_newPeriod': 1}, sort: {_id: -1}, skip: skip, limit: limit}).toArray(function (err, payments) {
                        if (err) {
                            accept(new Error('Mongo error - ' + err.message));
                            return;
                        }

                        if (typeof accept === 'function') {
                            accept(null, payments, count);
                        }
                    });
                });
            });
        }
    };

    next();
};