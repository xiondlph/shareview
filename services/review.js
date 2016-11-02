/**
 * Review сервис
 *
 * @module      Service.Review
 * @main        Shareview review service
 * @author      Ismax <admin@ismax.ru>
 */


// Объявление модулей
import querystring from 'querystring';
import { parseString } from 'xml2js';

const
    /**
     * Получение данных профиля
     *
     * @method get
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     */
    get = (req, res) => {
        var modelId,
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
        req.api(`/v1/search.xml?${query}`, (err, status, data) => {
            if (err || status !== 200) {
                res.send([]);
                return;
            }

            parseString(data, { mergeAttrs: true, explicitArray: false }, (err, result) => {
                if (err) {
                    res.send([]);
                    return;
                }

                if (+result['search-result'].count &&
                    result['search-result']['search-item'][0].model
                ) {
                    modelId = result['search-result']['search-item'][0].model.id;
                    req.api(
                        `/v1/model/${modelId}/opinion.xml?page=${page}`,
                        (err, status, data) => {
                            if (err || status !== 200) {
                                res.send([]);
                                return;
                            }

                            parseString(data, {
                                mergeAttrs: true,
                                explicitArray: false,
                            }, (err, reviews) => {
                                if (err) {
                                    res.send([]);
                                    return;
                                }

                                res.send(reviews);
                            });
                        });
                } else {
                    res.send([]);
                }
            });
        });
    };

export default {
    get,
};
