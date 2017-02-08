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
     * Получение отзывов
     *
     * @method get
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     */
    get = (req, res) => {
        var result,
            reviews,
            modelId,
            query = querystring.stringify(req.query),
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
                    });
            } else {
                res.send([]);
            }
        });
    };

export default {
    get,
};
