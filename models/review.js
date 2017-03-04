/**
 * Модель данных отзывов
 *
 * @module      Model.Review
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import { db } from '../db';

const

    /**
     * Экспорт методов модели данных отзывов
     *
     * @method review
     * @param {Object} req - Объект запроса сервера
     * @param {Object} res - Объект ответа сервера
     * @param {Function} next - Следующий слой обработки запроса
     */
    review = (req, res, next) => {
        // Инициализация объекта модели
        req.model = req.model || {};

        /**
         * Объект модели данных
         * интегрированный в объект запроса
         *
         * @attribute model.user
         * @type Object
         */
        req.model.review = {

            /**
             * Поиск модели по названию товара
             *
             * @method findModelByName
             * @param {String} name Наименование модели товара
             * @return {Promise}
             */
            findModelByName(name) {
                const
                    collection = db.collection('models');

                return collection.find({
                    $text: {
                        $search: name,
                    },
                }, {
                    score: {
                        $meta: 'textScore',
                    },
                }, {
                    sort: {
                        score: {
                            $meta: 'textScore',
                        },
                    },
                }).toArray();
            },

            /**
             * Получение списка отзывов по id модели
             *
             * @method getReviewsByModelId
             * @param {Object} swModelId Внутренний id модели
             * @return {Promise}
             */
            getReviewsByModelId(swModelId) {
                const
                    collection = db.collection('reviews');

                return collection.find({ swModelId }).toArray();
            },

            /**
             * Создание новой модели товара
             *
             * @method createModel
             * @param {Object} model
             * @return {Promise}
             */
            createModel(model) {
                return db.collection('models')
                    .insertOne(model);
            },

            /**
             * Вставка списка отзывов
             *
             * @method insertReviews
             * @param {Array} reviews
             * @return {Promise}
             */
            insertReviews(reviews) {
                return db.collection('reviews')
                    .insertMany(reviews);
            },
        };

        next();
    };

export default review;
