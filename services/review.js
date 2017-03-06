/**
 * Review сервис
 *
 * @module      Service.Review
 * @main        Shareview review service
 * @author      Ismax <admin@ismax.ru>
 */


// Объявление модулей
import querystring from 'querystring';

const

    /**
     * TODO В дальнейшем нужно вывести в отдельный сервис по извлечению отзывов
     *
     * Метод загрузки отзывов Яндекс.Маркета
     *
     * @method grab
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     */
    grabYMReview = (req, res) => {
        const query = querystring.stringify(req.query);

        let result,
            reviews,
            modelId,
            page = 1;

        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );

        if (!req.query.text) {
            res.send([]);
            return;
        }

        if (req.query.page) {
            page = req.query.page;
            delete req.query.page;
        }

        req.query.count = 1;
        req.api(`/v1/search.json?${query}`, (err, status, data) => {
            if (err || status !== 200) {
                res.send([]);
                return;
            }

            result = JSON.parse(data);

            /* eslint no-shadow: ["error", { "allow": ["err", "status", "data"] }] */
            if (result.searchResult.results.length > 0 && result.searchResult.results[0].model) {
                modelId = result.searchResult.results[0].model.id;
                req.api(
                    `/v1/model/${modelId}/opinion.json?page=${page}`,
                    (err, status, data) => {
                        if (err || status !== 200) {
                            res.send([]);
                            return;
                        }

                        reviews = JSON.parse(data);

                        res.send(reviews);

                        // Кеширование
                        // req.cachingYMReview(
                        //     result.searchResult.results[0].model,
                        //     reviews
                        // );
                    });
            } else {
                res.send([]);
            }
        });
    },

    /**
     * Получение отзывов
     *
     * @method get
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next Следующий слой обработки запроса
     */
    get = (req, res, next) => {
        req.model.review.findModelByName(req.query.text).then(models => {
            if (!models.length || models[0].score < 2) {
                next();
                return;
            }

            req.model.review.getReviewsByModelId(models[0]._id).then(reviews => {
                res.send(reviews);
            }).catch(err => {
                next(err);
            });
        }).catch(err => {
            next(err);
        });
    };

export default {
    grabYMReview,
    get,
};
